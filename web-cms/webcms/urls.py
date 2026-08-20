from django.contrib import admin
from django.urls import path, include
from wagtail.admin import urls as wagtailadmin_urls
from wagtail import urls as wagtail_urls
from wagtail.documents import urls as wagtaildocs_urls
from api.views import PagesViewSet, EventsViewSet, SpacesViewSet, EntitiesViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"pages", PagesViewSet, basename="page")
router.register(r"events", EventsViewSet, basename="event")
router.register(r"spaces", SpacesViewSet, basename="space")
router.register(r"entities", EntitiesViewSet, basename="entity")

urlpatterns = [
    path("django-admin/", admin.site.urls),
    path("admin/", include(wagtailadmin_urls)),
    path("documents/", include(wagtaildocs_urls)),
    path("api/v2/", include(router.urls)),
    path("", include(wagtail_urls)),
]
