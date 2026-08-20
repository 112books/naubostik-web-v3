from django.db import models
from wagtail.models import Page
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel


class EventsIndex(Page):
    template = "events/events_index.html"
    content_panels = Page.content_panels


class Event(Page):
    template = "events/event_page.html"
    parent_page_types = ["events.EventsIndex"]

    date = models.DateField()
    time_start = models.TimeField()
    time_end = models.TimeField(blank=True, null=True)
    entity_name = models.CharField(max_length=200, blank=True, verbose_name="Entitat organitzadora")
    space_name = models.CharField(max_length=200, blank=True, verbose_name="Espai")
    description = RichTextField(blank=True)
    image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    content_panels = Page.content_panels + [
        FieldPanel("date"),
        FieldPanel("time_start"),
        FieldPanel("time_end"),
        FieldPanel("entity_name"),
        FieldPanel("space_name"),
        FieldPanel("description"),
        FieldPanel("image"),
    ]
