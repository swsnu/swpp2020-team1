'''models.py: define models'''


from django.db import models
from django.conf import settings


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
        related_name='barcode_set',
        blank=True,
        null=True
    )

class Item(models.Model):
    ''' Item: information about items without expire_date and count '''
    name = models.CharField(max_length=128)
    container = models.CharField(max_length=16)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='item_set'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        related_name='item_set',
        blank=True,
        null=True
    )
    barcode = models.ForeignKey(
        Barcode,
        on_delete=models.SET_NULL,
        related_name='item_set',
        blank=True,
        null=True
    )

class ItemCount(models.Model):
    ''' Itemcount: storing information about expire_date and count '''
    expiration_date = models.CharField(max_length=16)
    count = models.PositiveSmallIntegerField(default=1)
    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        related_name='itemcount_set'
    )

class Notification(models.Model):
    ''' Notification: storing information about notification '''
    noti_type = models.CharField(max_length=8)
    is_read = models.BooleanField(default=False)
    expire_date = models.DateField(auto_now=False, auto_now_add=False)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='noti_set'
    )
    item_count = models.ForeignKey(
        ItemCount,
        on_delete=models.CASCADE,
        related_name='noti_set',
        blank=True,
        null=True
    )

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

