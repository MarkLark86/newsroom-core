import os
import bson.errors
from datetime import datetime, timezone, timedelta
from io import BytesIO

from werkzeug.utils import secure_filename

from superdesk.core import get_current_app, get_app_config
from superdesk.flask import request, url_for, Blueprint, abort
from superdesk.upload import upload_url as _upload_url
from superdesk.media.media_operations import guess_media_extension

import newsroom
from newsroom.decorator import is_valid_session, clear_session_and_redirect_to_login


cache_for = 3600 * 24 * 7  # 7 days cache
ASSETS_RESOURCE = "upload"
blueprint = Blueprint(ASSETS_RESOURCE, __name__)


async def get_file(key):
    file = (await request.files).get(key)
    if file:
        filename = secure_filename(file.filename)
        get_current_app().media.put(file, resource=ASSETS_RESOURCE, _id=filename, content_type=file.content_type)
        return url_for("upload.get_upload", media_id=filename)


@blueprint.route("/assets/<path:media_id>", methods=["GET"])
async def get_upload(media_id, filename=None):
    # Allow access to ``/assets/<media_id>`` if PUBLIC_DASHBOARD is enabled or is a valid session
    if not get_app_config("PUBLIC_DASHBOARD") and not await is_valid_session():
        return clear_session_and_redirect_to_login()

    app = get_current_app()

    try:
        media_file = app.media.get(media_id, ASSETS_RESOURCE)
    except bson.errors.InvalidId:
        media_file = None
    if not media_file:
        abort(404)

    file_body = app.as_any().response_class.io_body_class(BytesIO(media_file.read()))
    response = app.response_class(file_body, mimetype=media_file.content_type)
    response.content_length = media_file.length
    response.last_modified = media_file.upload_date
    response.set_etag(media_file.md5)
    response.cache_control.max_age = cache_for
    response.cache_control.s_max_age = cache_for
    response.cache_control.public = True
    response.expires = datetime.now(timezone.utc) + timedelta(seconds=cache_for)

    # Add ``accept_ranges`` & ``complete_length`` so video seeking is supported
    await response.make_conditional(request, accept_ranges=True, complete_length=media_file.length)

    if filename is None and request.args.get("filename"):
        filename = request.args.get("filename")

    if filename:
        _filename, ext = os.path.splitext(filename)
        if not ext:
            ext = guess_media_extension(media_file.content_type)
        filename = secure_filename(f"{_filename}{ext}")
        response.headers["Content-Type"] = media_file.content_type
        response.headers["Content-Disposition"] = 'attachment; filename="{}"'.format(filename)
    else:
        response.headers["Content-Disposition"] = "inline"

    return response


def upload_url(media_id):
    return _upload_url(media_id, view="assets.get_media_streamed")


def init_app(app):
    app.upload_url = upload_url
    app.config["DOMAIN"].setdefault(
        "upload",
        {
            "authentication": None,
            "mongo_prefix": newsroom.MONGO_PREFIX,
            "internal_resource": True,
        },
    )
