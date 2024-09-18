from superdesk.core.module import Module

from .topics_async import topic_resource_config, topic_endpoints, get_user_topics


__all__ = ["get_user_topics", "topic_endpoints", "topic_resource_config"]


module = Module(
    name="newsroom.topics",
    resources=[topic_resource_config],
    endpoints=[topic_endpoints],
)

from . import views  # noqa
