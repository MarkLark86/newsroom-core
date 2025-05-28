from newsroom.types import SectionEnum
from newsroom.wire import WireSearchServiceAsync
from newsroom.wire.search import WireSearchResource, WireSearchService


class FactCheckSearchResource(WireSearchResource):
    pass


class FactCheckSearchService(WireSearchService):
    section = "factcheck"


class FactCheckSearchServiceAsync(WireSearchServiceAsync):
    section = SectionEnum.FACTCHECK
