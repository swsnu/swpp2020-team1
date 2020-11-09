''' admin.py: register models '''

from django.contrib import admin
from .models import Category, Barcode, Item, ItemCount

# Register your models here.
admin.site.register(Category)
admin.site.register(Barcode)
admin.site.register(Item)
admin.site.register(ItemCount)
