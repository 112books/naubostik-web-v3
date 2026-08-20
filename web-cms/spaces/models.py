from django.db import models
from wagtail.models import Page
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel


class SpacesIndex(Page):
    template = "spaces/spaces_index.html"
    content_panels = Page.content_panels


class Space(Page):
    template = "spaces/space_page.html"
    parent_page_types = ["spaces.SpacesIndex"]

    FLOOR_CHOICES = [
        ("pb", "Planta baixa"),
        ("p1", "Primera Planta"),
        ("p2", "Segona Planta"),
        ("p3", "Tercera Planta"),
    ]
    floor = models.CharField(max_length=10, choices=FLOOR_CHOICES)
    description = RichTextField(blank=True)
    image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    capacity = models.PositiveIntegerField(null=True, blank=True)
    equipment = RichTextField(blank=True)
    cedible = models.BooleanField(default=False, verbose_name="Cedible per lloguer")

    content_panels = Page.content_panels + [
        FieldPanel("floor"),
        FieldPanel("description"),
        FieldPanel("image"),
        FieldPanel("capacity"),
        FieldPanel("equipment"),
        FieldPanel("cedible"),
    ]
