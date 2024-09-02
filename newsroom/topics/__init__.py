import superdesk
from superdesk.core.module import Module

from . import folders
from .topics_async import topic_resource_config, topic_endpoints, init, get_user_topics  # noqa
from .folders_async import UserFoldersResourceService, CompanyFoldersResourceService


def init_app(app):
    folders.FoldersResource("topic_folders", app, folders.folders_service)

    superdesk.register_resource("user_topic_folders", folders.UserFoldersResource, folders.UserFoldersService, _app=app)
    superdesk.register_resource(
        "company_topic_folders", folders.CompanyFoldersResource, folders.CompanyFoldersService, _app=app
    )


module = Module(
    init=init,
    name="newsroom.topics",
    resources=[topic_resource_config],
    endpoints=[topic_endpoints],
)


async def get_user_folders(user, section):
    mongo_cursor = await UserFoldersResourceService().search(
        lookup={
            "user": user["_id"],
            "section": section,
        },
    )
    return await mongo_cursor.to_list_raw()


async def get_company_folders(company, section):
    mongo_cursor = await CompanyFoldersResourceService().search(
        lookup={
            "company": company["_id"],
            "section": section,
        },
    )
    return await mongo_cursor.to_list_raw()


from . import views  # noqa
