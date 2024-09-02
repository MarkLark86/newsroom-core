import asyncio
from superdesk.tests import setup as setup_app
from superdesk.tests.environment import setup_before_all
import logging

from newsroom.news_api.app import get_app
from newsroom.news_api.default_settings import CORE_APPS, MODULES


logger = logging.getLogger(__name__)


def before_all(context):
    config = {
        "BEHAVE": True,
        "CORE_APPS": CORE_APPS,
        "MODULES": MODULES,
        "INSTALLED_APPS": [],
        "ELASTICSEARCH_FORCE_REFRESH": True,
        "NEWS_API_ENABLED": True,
        "NEWS_API_IMAGE_PERMISSIONS_ENABLED": True,
        "NEWS_API_TIME_LIMIT_DAYS": 100,
        "SITE_NAME": "Newsroom",
        "CACHE_TYPE": "null",
    }
    setup_before_all(context, config, app_factory=get_app)


def before_scenario(context, scenario):
    try:
        loop = asyncio.get_event_loop()
        loop.run_until_complete(before_scenario_async(context, scenario))
    except Exception as e:
        # Make sure exceptions raised are printed to the console
        logger.exception(e)
        raise e


async def before_scenario_async(context, scenario):
    config = {
        "BEHAVE": True,
        "CORE_APPS": CORE_APPS,
        "MODULES": MODULES,
        "INSTALLED_APPS": [],
        "ELASTICSEARCH_FORCE_REFRESH": True,
        "NEWS_API_ENABLED": True,
        "NEWS_API_IMAGE_PERMISSIONS_ENABLED": True,
        "NEWS_API_TIME_LIMIT_DAYS": 100,
        "SITE_NAME": "Newsroom",
        "CACHE_TYPE": "null",
    }

    if "rate_limit" in scenario.tags:
        config["RATE_LIMIT_PERIOD"] = 300  # 5 minutes
        config["RATE_LIMIT_REQUESTS"] = 2

    await setup_app(context, config, app_factory=get_app, reset=True)
    context.headers = []
