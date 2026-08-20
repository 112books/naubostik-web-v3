from rest_framework import viewsets
from wagtail.models import Page
from home.models import HomePage, StaticPage
from events.models import Event
from spaces.models import Space
from entities.models import Entity
from .serializers import (
    PageSerializer,
    HomePageSerializer,
    StaticPageSerializer,
    EventSerializer,
    SpaceSerializer,
    EntitySerializer,
)


class PagesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Page.objects.live().public()
    serializer_class = PageSerializer


class EventsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.live().public().order_by("-date")
    serializer_class = EventSerializer


class SpacesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Space.objects.live().public()
    serializer_class = SpaceSerializer


class EntitiesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Entity.objects.live().public()
    serializer_class = EntitySerializer
