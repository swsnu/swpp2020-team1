''' init_db.py: initialize recipe and category '''

import csv
from .models import Category, Recipe

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
