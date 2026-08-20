from rest_framework import serializers
from wagtail.models import Page
from home.models import HomePage, StaticPage
from events.models import Event
from spaces.models import Space
from entities.models import Entity


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ["id", "title", "slug", "url_path"]


class HomePageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomePage
        fields = ["id", "title", "hero_title", "hero_subtitle", "hero_cta_text", "hero_cta_link", "status_text", "status_color"]


class StaticPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaticPage
        fields = ["id", "title", "slug", "body"]


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            "id", "title", "slug", "date", "time_start", "time_end",
            "entity_name", "space_name", "description",
        ]


class SpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Space
        fields = [
            "id", "title", "slug", "floor", "description",
            "capacity", "equipment", "cedible",
        ]


class EntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entity
        fields = ["id", "title", "slug", "description", "website"]
