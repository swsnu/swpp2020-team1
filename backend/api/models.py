from django.db import models
from django.conf import settings
import datetime
'''
@luvimperfection: Comments are to be deleted after being reflected to the documents
'''

class Category(models.Model):
    '''
    [ Category.name ] refers to the name of category.
                      ex. category '우유' - item '서울우유200ml', '매일우유초코200ml', '파스퇴르우유200ml', '서울우유1.5L'
    '''
    name = models.CharField(max_length=32)

class Barcode(models.Model):
    '''
    [ `category`.barcode_set ] returns QuerySet<Barcode> that contains barcodes whose category is `category`
    '''
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
    '''
    [ Item.name ] refers to Item's custom name
    [ Item.container] refers to the container in which item is stored. 
                      types of container - 1) fridge 2) freezer 3) shelf
    [ `user`.item_set ] returns QuerySet<Item> that contains items whose user is `user` 
    [ `category`.item_set ] returns QuerySet<Item> that contains items whose category is `category`
    [ `barcode`.item_set ] returns QuerySet<Item> that contains items whose barcode is `barcode`
    '''
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
    ''' 
    key: (item_id, expiration_date)
    Items with same item_id, but different expiration_date --> Separate ItemCount 
    [ ItemCount.count] refers to the number of items with specific (`item_id`, `expiration_date`)
                       default value - set to 1
    [ `item`.itemcount_set ] returns QuerySet<ItemCount> that contains itemcounts whose item is `item` 
                       ex. [서울우유 due 11/31](2개), [서울우유 due 12/2](3개), [서울우유 due 12/4](1개)
    '''
    expiration_date = models.CharField(max_length=16)
    count = models.PositiveSmallIntegerField(default=1)
    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        related_name='itemcount_set'
    )

class Notification(models.Model):
    '''
    [ Notification.noti_type] refers to the type of notifications
                      types of notification - 1) expire 2) buy_item 3) recipe
    [ Notification.is_read] refers to whether the user has read(clicked) the notification
    [ Notification.expire_date] refers to the expiration date of `item_count`
    [ `user`.noti_set ] returns QuerySet<Notification> that contains notifications whose user is `user`
    [ `item_count`.noti_set ] returns QuerySet<Notification> that contains notifications whose item_count is `item_count`
    '''
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
    