''' init_db.py: initialize recipe and category '''

import csv
from .models import Category, Recipe, Barcode

def initialize_category():
    ''' initialize_category: initialize category '''
    category_list = []
    with open('csvfiles/category.csv', 'r', encoding='utf-8') as categories:
        reader = csv.reader(categories)
        for line in reader:
            category_list.append(line[0])
    for category_name in category_list:
        Category(name=category_name).save()
    Category(id=200, name='기타').save()

def initialize_recipe():
    ''' initialize_recipe: initialize recipe '''
    recipe_list = []
    with open('csvfiles/recipe.csv', 'r', encoding='utf-8') as recipes:
        reader = csv.reader(recipes)
        for line in reader:
            recipe_list.append(line)
    for recipe in recipe_list:
        recipe_obj = Recipe(title=recipe[0], description=recipe[1], video_url=recipe[2],
            cuisine_type=recipe[3])
        recipe_obj.save()
        ingredients = recipe[4].split(',')
        for ingredient_name in ingredients:
            category_obj = Category.objects.filter(name=ingredient_name)[0]
            recipe_obj.ingredients.add(category_obj)
        recipe_obj.save()

def initialize_barcode():
    ''' initialize_barcode: initialize barcode'''
    bulk_list = []
    etc_category = Category.objects.get(id=200)
    with open('csvfiles/barcode.csv', 'r', encoding='utf8') as barcodes:
        reader = csv.reader(barcodes)
        for line in reader:
            category = None
            if len(line) > 2:
                category = Category.objects.get(name=line[2])
            else:
                category = etc_category
            bulk_list.append(Barcode(barcode_num=line[0], item_name=line[1], category=category))
    Barcode.objects.bulk_create(bulk_list)
