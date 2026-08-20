from django.db import models
from wagtail.models import Page
from wagtail.fields import RichTextField, StreamField
from wagtail.blocks import CharBlock, TextBlock, URLBlock
from wagtail.images.blocks import ImageChooserBlock
from wagtail.admin.panels import FieldPanel


class HomePage(Page):
    template = "home/home_page.html"

    hero_title = models.CharField(max_length=200, blank=True)
    hero_subtitle = RichTextField(blank=True)
    hero_cta_text = models.CharField(max_length=100, blank=True)
    hero_cta_link = models.URLField(blank=True)

    status_text = models.CharField(max_length=200, blank=True)
    STATUS_CHOICES = [
        ("green", "Obert"),
        ("amber", "Parcial"),
        ("red", "Tancat"),
    ]
    status_color = models.CharField(max_length=20, choices=STATUS_CHOICES, default="green")

    content_panels = Page.content_panels + [
        FieldPanel("hero_title"),
        FieldPanel("hero_subtitle"),
        FieldPanel("hero_cta_text"),
        FieldPanel("hero_cta_link"),
        FieldPanel("status_text"),
        FieldPanel("status_color"),
    ]


class StaticPage(Page):
    template = "home/static_page.html"

    body = StreamField(
        [
            ("heading", CharBlock()),
            ("paragraph", TextBlock()),
            ("image", ImageChooserBlock()),
            ("link", URLBlock()),
        ],
        blank=True,
        use_json_field=True,
    )

    content_panels = Page.content_panels + [
        FieldPanel("body"),
    ]
