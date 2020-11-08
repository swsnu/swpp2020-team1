from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=32)

class Barcode(models.Model):
    barcode_num = models.CharField(max_length=32, primary_key=True, unique=True)
    item_name = models.CharField(max_length=128)
    category = models.CharField(max_length=32)

class Item(models.Model):
    name = models.CharField(max_length=128)
    container = models.CharField(max_length=16)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='user'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        related_name='category',
        blank=True,
        null=True
    )
    barcode = models.ForeignKey(
        Barcode,
        on_delete=models.SET_NULL,
        related_name='barcode',
        blank=True,
        null=True
    )

class ItemCount(models.Model):
    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        related_name='item'
    )
    expiration_date = models.CharField(max_length=16)
    count = models.PositiveSmallIntegerField(default=1)