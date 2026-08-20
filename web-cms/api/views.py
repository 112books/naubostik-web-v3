from rest_framework import viewsets
from wagtail.models import Page
from events.models import Event
from spaces.models import Space
from entities.models import Entity
from .serializers import (
    PageSerializer,
    EventSerializer,
    SpaceSerializer,
    EntitySerializer,
)


class PagesViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PageSerializer

    def get_queryset(self):
        return Page.objects.live().public()


class EventsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EventSerializer

    def get_queryset(self):
        return Event.objects.live().public().order_by("-date")


class SpacesViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SpaceSerializer

    def get_queryset(self):
        return Space.objects.live().public()


class EntitiesViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EntitySerializer

    def get_queryset(self):
        return Entity.objects.live().public()
