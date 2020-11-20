''' models.py: define models '''


from django.db import models
from django.conf import settings

# Create your models here.

class Category(models.Model):
    ''' Category: storing list of food categories '''
    name = models.CharField(max_length=32)

class Barcode(models.Model):
    ''' Barcode: storing information about barcode numbers '''
    barcode_num = models.CharField(max_length=32, primary_key=True, unique=True)
    item_name = models.CharField(max_length=128)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        related_name='category_barcode',
        blank=True,
        null=True
    )

class Item(models.Model):
    ''' Item: information about items without expiration_date and count '''
    name = models.CharField(max_length=128)
    container = models.CharField(max_length=16)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
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
    barcode = models.ForeignKey( # jaeseok: is barcode foreign key?
        Barcode,
        on_delete=models.SET_NULL,
        related_name='barcode',
        blank=True,
        null=True
    )

class ItemCount(models.Model):
    ''' ItemCount: information about expiration_date and count of the item'''
    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        related_name='item'
    )
    expiration_date = models.CharField(max_length=16)
    count = models.PositiveSmallIntegerField(default=1)

class Recipe(models.Model):
    '''Recipe: information about recipe'''
    title = models.CharField(max_length=128)
    description = models.TextField()
    video_url = models.CharField(max_length=256)
    rating_sum = models.PositiveIntegerField(default=0)
    rating_count = models.PositiveIntegerField(default=0)
    rating_users = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='rated_recipe_set'
    )

class RecipeComment(models.Model):
    '''RecipeComment: information about comments of recipes'''
    content = models.TextField()
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comment_set'
    )
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='comment_set'
    )
    date = models.DateTimeField(auto_now_add=True)
