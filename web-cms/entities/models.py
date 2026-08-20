from django.db import models
from wagtail.models import Page
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel


class EntitiesIndex(Page):
    template = "entities/entities_index.html"
    content_panels = Page.content_panels


class Entity(Page):
    template = "entities/entity_page.html"
    parent_page_types = ["entities.EntitiesIndex"]

    logo = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    description = RichTextField(blank=True)
    website = models.URLField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel("logo"),
        FieldPanel("description"),
        FieldPanel("website"),
    ]
