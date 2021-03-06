''' views.py: define views '''


import json
from json import JSONDecodeError
from itertools import chain
import datetime
import random
from datetime import timedelta
from django.http import HttpResponse, JsonResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import get_user_model
from .models import Category, Barcode, Item, ItemCount, Recipe, RecipeComment, Notification
from .init_db import initialize_category, initialize_recipe, initialize_barcode

# Create your views here.

def signup(request):
    '''
    signup:
        POST: create user
    '''
    if request.method == 'POST':
        try:
            req_data = json.loads(request.body.decode())
            email = req_data['email']
            password = req_data['password']
            nickname = req_data['nickname']
        except (KeyError, JSONDecodeError) as error:
            print(error)
            return HttpResponseBadRequest()
        user = get_user_model()
        user.objects.create_user(username=email, password=password, first_name=nickname)
        new_user = user.objects.get(username=email)
        if Category.objects.all().count() == 0 or Recipe.objects.all().count() == 0:
            initialize_category()
            initialize_recipe()
        if Barcode.objects.all().count() == 0:
            initialize_barcode()
        initialize_sample(new_user)
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['POST'])

def signin(request):
    '''
    signin:
        POST: sign in with given username and password
    '''
    if request.method == 'POST':
        try:
            req_data = json.loads(request.body.decode())
            username = req_data['username']
            password = req_data['password']
        except (KeyError, JSONDecodeError) as error:
            print(error)
            return HttpResponseBadRequest()
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['POST'])

def signout(request):
    '''
    signout:
        GET: sign out from current account
    '''
    if request.method == 'GET':
        if request.user.is_authenticated:
            logout(request)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET'])

def user_info(request):
    '''
    user_info:
        GET: sign in:
    '''
    if request.method == 'GET':
        if request.user.is_authenticated:
            username_dic = { 'username' : request.user.username, 'user_id': request.user.id}
            return JsonResponse(username_dic,status = 200)
        else:
            return HttpResponse(status = 401)
    else:
        return HttpResponseNotAllowed(['GET'])

@ensure_csrf_cookie
def token(request):
    '''
    token:
        GET: get csrf token
    '''
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])

def item_count_test(request): # jaeseok: this api is for debugging.
    '''
    item_count_test:
        GET: get all ItemCounts. this is for debugging purpose.
    '''
    if request.method == 'GET':
        all_item_count_list = list(ItemCount.objects.all().values())
        return JsonResponse(all_item_count_list, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])

def item_list(request):
    '''
    item_list:
        GET: get all Items. this is for debugging purpose.
        POST: add an item
    '''
    if request.method == 'GET':
        all_item_list = list(Item.objects.all().values())
        return JsonResponse(all_item_list, safe=False)
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        # jaeseok: check if the user is authenticated
        try:
            body = request.body.decode()
            name = json.loads(body)['name']
            container = json.loads(body)['container']
            category_id = json.loads(body)['category_id']
            barcode_num = json.loads(body)['barcode_num']
            expiration_date = json.loads(body)['expiration_date']
            count = json.loads(body)['count']
            user = request.user
        except (KeyError, JSONDecodeError) as error:
            print(error)
            return HttpResponseBadRequest()

        barcode = Barcode.objects.filter(barcode_num=barcode_num).first() if barcode_num else None
        category = Category.objects.filter(id=category_id).first() if category_id else None
        same_item = None
        new_item = None
        same_item_count = None
        new_item_count = None

        item_dup = Item.objects.filter(user_id=user.id, barcode__barcode_num=barcode_num)
        if item_dup.count() == 1:
            # record with same user_id and barcode_num exists.
            same_item = item_dup[0]
            same_item.name = name
            same_item.container = container
            same_item.category = category
            same_item.barcode = barcode
            same_item.save()
            item_count_dup = ItemCount.objects.filter(
                item_id=same_item.id,
                expiration_date=expiration_date
            )
            if item_count_dup.count() == 1:
                # item_count with same expiration date exists, modify existing record
                same_item_count = item_count_dup[0]
                same_item_count.count += count
                same_item_count.save()
            elif item_count_dup.count() == 0:
                # item_count with same expiration date doesn't exists, create a new record
                new_item_count = ItemCount(
                    item=same_item,
                    expiration_date=expiration_date,
                    count=count,
                )
                new_item_count.save()
        elif item_dup.count() == 0:
            # no record with same user_id and barcode_num.
            if barcode is not None:
                # barcode number is provided. create a new item and item_count
                new_item = Item(name=name, user=user, container=container,
                    category=category, barcode=barcode)
                new_item_count = ItemCount(item=new_item,
                    expiration_date=expiration_date, count=count)
                new_item.save()
                new_item_count.save()
            else:
                # barcode number is not provided. find record with same item name with empty barcode
                item_name_dup = Item.objects.filter(user_id=user.id, name=name, barcode=None)
                if item_name_dup.count() == 1:
                    # record with same user_id and item name exists.
                    same_item = item_name_dup[0]
                    same_item.container = container
                    same_item.category = category
                    same_item.save()
                    item_count_dup = ItemCount.objects.filter(
                        item_id=same_item.id,
                        expiration_date=expiration_date
                    )
                    if item_count_dup.count() == 1:
                        # item_count with same expiration date exists, modify existing record
                        same_item_count = item_count_dup[0]
                        same_item_count.count += count
                        same_item_count.save()
                    elif item_count_dup.count() == 0:
                        # item_count with same expiration date doesn't exists, create a new record
                        new_item_count = ItemCount(
                            item=same_item,
                            expiration_date=expiration_date,
                            count=count,
                        )
                        new_item_count.save()
                elif item_name_dup.count() == 0:
                    # no record with same user_id and item name. create a new item and a item_count
                    new_item = Item(
                        name=name,
                        user=user,
                        container=container,
                        category=category,
                        barcode=barcode,
                    )
                    new_item_count = ItemCount(
                        item=new_item,
                        expiration_date=expiration_date,
                        count=count,
                    )
                    new_item.save()
                    new_item_count.save()
        response_dict = {}
        if same_item is not None:
            response_dict['item_found'] = True
            response_dict['item'] = {
                'id': same_item.id,
                'name': same_item.name,
                'container': same_item.container,
                'user_id': same_item.user_id,
                'category_id': same_item.category_id,
                'barcode_num': same_item.barcode_id
            }
        elif new_item is not None:
            response_dict['item_found'] = False
            response_dict['item'] = {
                'id': new_item.id,
                'name': new_item.name,
                'container': new_item.container,
                'user_id': new_item.user_id,
                'category_id': new_item.category_id,
                'barcode_num': new_item.barcode_id
            }
        else:
            print("Failed: cannot add item.")
            return HttpResponseBadRequest()

        if same_item_count is not None:
            response_dict['itemcount_found'] = True
            response_dict['itemcount'] = {
                'id': same_item_count.id,
                'item_id': same_item_count.item_id,
                'expiration_date': same_item_count.expiration_date,
                'count': same_item_count.count
            }
        elif new_item_count is not None:
            response_dict['itemcount_found'] = False
            response_dict['itemcount'] = {
                'id': new_item_count.id,
                'item_id': new_item_count.item_id,
                'expiration_date': new_item_count.expiration_date,
                'count': new_item_count.count
            }
            expire_date_string = new_item_count.expiration_date
            expire_date = datetime.datetime.strptime(expire_date_string, "%Y/%m/%d")
            noti = Notification(user=user, noti_type='expire', item_count=new_item_count,
                                is_read=False, expire_date=expire_date)
            noti.save()

        else:
            print("Failed: cannot add item count.")
            return HttpResponseBadRequest()

        return JsonResponse(response_dict, status=201)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

def item_user(request, user_id=0):
    '''
    item_user:
        GET: get all Items of certain user
    '''
    if request.method == 'GET':
        # jaeseok: check user existence
        all_item_list = list(Item.objects.filter(user_id=user_id).values())
        list_len = len(all_item_list)
        for i in range(list_len):
            curr_category_id = all_item_list[i]['category_id']
            if curr_category_id:
                all_item_list[i]['category_name'] = Category.objects.get(id=curr_category_id).name
            else:
                all_item_list[i]['category_name'] = None
        return JsonResponse(all_item_list, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])

def item_count_list(request, item_id=0):
    '''
    item_count_list:
        GET: get all ItemCounts of certain item
    '''
    if request.method == 'GET':
        all_item_count_list = list(ItemCount.objects.filter(item_id=item_id).values())
        return JsonResponse(all_item_count_list, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])

def barcode_info(request, barcode_num=0):
    '''
    barcode_info:
        GET: get barcode info
    '''
    if request.method == 'GET':
        try:
            barcode = Barcode.objects.get(barcode_num=str(barcode_num))
        except Barcode.DoesNotExist as error:
            print(error)
            return HttpResponse(status=404)
        return JsonResponse({
            'barcode_num': barcode.barcode_num,
            'item_name': barcode.item_name,
            'category_id': barcode.category.id,
            'category_name': barcode.category.name
        })
    else:
        return HttpResponseNotAllowed(['GET'])

def barcode_list(request):
    '''
    barcode_list:
        POST: add barcode info
    '''
    if request.method == 'POST':
        try:
            body = request.body.decode()
            barcode_num = json.loads(body)['barcode_num']
            item_name = json.loads(body)['item_name']
            category_id = json.loads(body)['category_id']
        except (KeyError, JSONDecodeError) as error:
            print(error)
            return HttpResponseBadRequest()
        category = Category.objects.filter(id=category_id).first() if category_id else None
        barcode = Barcode(barcode_num=barcode_num, item_name=item_name, category=category)
        barcode.save()
        response_dict = {
            'barcode_num': barcode.barcode_num,
            'item_name': barcode.item_name,
            'category_id': barcode.category.id,
            'category_name': barcode.category.name
        }
        return JsonResponse(response_dict, status=201)
    else:
        return HttpResponseNotAllowed(['POST'])

def category_info(request, category_id=0):
    '''
    category_info:
        GET: category_info
    '''
    if request.method == 'GET':
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist as error:
            print(error)
            return HttpResponse(status=404)
        return JsonResponse({
            'id': category.id,
            'name': category.name,
        })
    else:
        return HttpResponseNotAllowed(['GET'])

def category_list(request):
    '''
    category_list:
        GET: get all categories
        POST: add category info
    '''
    if request.method == 'GET':
        all_category_list = list(Category.objects.all().values())
        return JsonResponse(all_category_list, safe=False)
    elif request.method == 'POST':
        try:
            body = request.body.decode()
            name = json.loads(body)['name']
        except (KeyError, JSONDecodeError) as error:
            print(error)
            return HttpResponseBadRequest()
        category = Category(name=name)
        category.save()
        response_dict = {
            'id': category.id,
            'name': category.name
        }
        return JsonResponse(response_dict, status=201)
    else:
        return HttpResponseNotAllowed(['POST'])

def item_count_info(request, item_count_id=0):
    '''
    item_count_info:
        PUT: modify count of the item_count
    '''
    if request.method == 'PUT':
        is_deleted = False
        try:
            item_count = ItemCount.objects.get(id=item_count_id)
            item_expire_noti = Notification.objects.get(
                item_count_id=item_count_id, noti_type='expire')
            item_buy_noti = Notification.objects.filter(
                item_count_id=item_count_id, noti_type='buy_item').first()
            user = request.user
        except ItemCount.DoesNotExist as error:
            print(error)
            return HttpResponse(status=404)
        except Notification.DoesNotExist as error:
            print(error)
            return HttpResponse(status=404)
        try:
            body = request.body.decode()
            count = json.loads(body)['count']
        except (KeyError, JSONDecodeError) as error:
            print(error)
            return HttpResponseBadRequest()
        if count > 0:
            item_count.count = count
            item_count.save()
            if count == 1 and ItemCount.objects.filter(item_id=item_count.item_id).count() == 1:
                current_date = datetime.datetime.now() # this is not expire date, but current date.
                new_buy_noti = Notification(user=user, noti_type='buy_item',
                    expire_date=current_date, item_count=item_count, is_read=False)
                new_buy_noti.save()
        elif count == 0:
            item_count.delete()
            item_expire_noti.delete()
            if item_buy_noti:
                item_buy_noti.delete()
            is_deleted = True
        else:
            print("ERROR: illegal count {}".format(count))
            return HttpResponseBadRequest()
        response_dict = {}
        if is_deleted:
            response_dict = {
                'is_deleted': True
            }
        else:
            response_dict = {
                'is_deleted': False,
                'itemcount': {
                    'id': item_count.id,
                    'item_id': item_count.item_id,
                    'expiration_date': item_count.expiration_date,
                    'count': item_count.count
                }
            }
        return JsonResponse(response_dict, status=200)
    else:
        return HttpResponseNotAllowed(['PUT'])

def recipe_list(request):
    '''
    recipe_list:
        GET: get all recipes
    '''
    if request.method == 'GET':
        recipes = [
            {
                'id': recipe.id,
                'title': recipe.title,
                'description': recipe.description,
                'video_url': recipe.video_url,
                'cuisine_type': recipe.cuisine_type,
                'ingredients': [ingredient.id for ingredient in recipe.ingredients.all()],
                'rating_average': 0 if recipe.rating_count == 0 else \
                                recipe.rating_sum / recipe.rating_count
            }
            for recipe in Recipe.objects.all()]
        return JsonResponse(recipes, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])

def recipe_search(request):
    '''
    recipe_search:
        POST: get recipes by ingredients and preference
    '''
    if request.method == 'POST':
        try:
            body = request.body.decode()
            ingredients = json.loads(body)['ingredients']
            preference = json.loads(body)['preference']
        except (KeyError, JSONDecodeError) as error:
            print(error)
            return HttpResponseBadRequest()
        ingredients_set = set(ingredients)
        recipe_queryset = Recipe.objects.none()
        for one_preference in preference:
            recipe_queryset = recipe_queryset.union(
                Recipe.objects.filter(cuisine_type=one_preference))
        recipes = [
            {
                'id': recipe.id,
                'title': recipe.title,
                'description': recipe.description,
                'video_url': recipe.video_url,
                'cuisine_type': recipe.cuisine_type,
                'ingredients': [ingredient.id for ingredient in recipe.ingredients.all()],
                'rating_average': -1 if recipe.rating_count == 0 else \
                                recipe.rating_sum / recipe.rating_count
            }
            for recipe in recipe_queryset]
        for recipe in recipes:
            recipe['num_ingredients'] = len(set(recipe['ingredients'])
                .intersection(ingredients_set))
        random.shuffle(recipes)
        recipes_sorted = sorted(recipes, key=lambda recipe: -recipe['num_ingredients'])
        recipes_with_ingredients = [recipe for recipe
            in recipes_sorted if recipe['num_ingredients'] > 0]
        if len(recipes_with_ingredients) > 0:
            return JsonResponse(recipes_with_ingredients, safe=False)
        else:
            return JsonResponse(recipes_sorted[:20], safe=False)
    else:
        return HttpResponseNotAllowed(['POST'])

def recipe_info(request, recipe_id=0):
    '''
    recipe_info:
        GET: get specific recipe
        PUT: add new rating to a recipe
    '''
    if request.method == 'GET':
        # check if recipe exists
        try:
            recipe = Recipe.objects.get(id=recipe_id)
        except Recipe.DoesNotExist as error:
            print(error)
            return HttpResponse(status=404)
        ingredients_list = [ingredient.id for ingredient in recipe.ingredients.all()]
        return JsonResponse({
                'id': recipe.id,
                'title': recipe.title,
                'description': recipe.description,
                'video_url': recipe.video_url,
                'cuisine_type': recipe.cuisine_type,
                'ingredients': ingredients_list,
                'rating_average': 0 if recipe.rating_count == 0 else \
                                recipe.rating_sum / recipe.rating_count
        })
    elif request.method == 'PUT':
        # check if logged in
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        # check contents of request
        try:
            body = request.body.decode()
            rating = json.loads(body)['rating']
        except (KeyError, JSONDecodeError) as error:
            print(error)
            return HttpResponseBadRequest()
        # check if recipe exists
        try:
            recipe = Recipe.objects.get(id=recipe_id)
        except Recipe.DoesNotExist as error:
            print(error)
            return HttpResponse(status=404)


        recipe.rating_users.add(request.user)
        recipe.rating_sum += rating
        recipe.rating_count += 1
        recipe.save()
        response_dict = {
            'id': recipe.id,
            'title': recipe.title,
            'description': recipe.description,
            'video_url': recipe.video_url,
            'cuisine_type': recipe.cuisine_type,
            'ingredients': [ingredient.id for ingredient in recipe.ingredients.all()],
            'rating_average': recipe.rating_sum / recipe.rating_count,
        }
        return JsonResponse(response_dict)
    else:
        return HttpResponseNotAllowed(['GET', 'PUT'])

def recipe_rating(request):
    '''
    recipe_list:
        GET: get recipe list that the user has given rating
    '''
    if request.method == 'GET':
        # check if logged in
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        recipe_ids = [recipe.id for recipe in request.user.rated_recipe_set.all()]
        return JsonResponse(recipe_ids, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])

def comment_list(request, recipe_id=0):
    '''
    comment_list:
        GET: get all comments of specific recipe
        POST: create new comment
    '''
    if request.method == 'GET':
        comments = [
            {
                'id': comm.id,
                'content': comm.content,
                'author_id': comm.author_id,
                'author': get_user_model().objects.get(id=comm.author_id).first_name,
                'recipe_id': comm.recipe_id,
                'date': comm.date
            }
            for comm in RecipeComment.objects.filter(recipe_id=recipe_id)
        ]
        return JsonResponse(comments, safe=False)
    elif request.method == 'POST':
        # check if logged in
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        # check contents of request
        try:
            body = request.body.decode()
            content = json.loads(body)['content']
        except (KeyError, JSONDecodeError) as error:
            print(error)
            return HttpResponseBadRequest()
        # check if recipe exists
        try:
            recipe = Recipe.objects.get(id=recipe_id)
        except Recipe.DoesNotExist as error:
            print(error)
            return HttpResponse(status=404)
        comm = RecipeComment(content=content, author=request.user, recipe=recipe)
        comm.save()
        response_dict = {
            'id': comm.id,
            'content': comm.content,
            'author_id': request.user.id,
            'author': request.user.first_name,
            'recipe_id': comm.recipe_id,
            'date': comm.date
        }
        return JsonResponse(response_dict, status=201)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

def comment_info(request, comment_id=0):
    '''
    comment_info:
        GET: get specific comment
        PUT: edit specific comment
        DELETE: delete specific comment
    '''
    if request.method == 'GET':
        # check if comment exists
        try:
            comm = RecipeComment.objects.get(id=comment_id)
        except RecipeComment.DoesNotExist as error:
            print(error)
            return HttpResponse(status=404)
        return JsonResponse({
            'id': comm.id,
            'content': comm.content,
            'author_id': comm.author.id,
            'author': comm.author.first_name,
            'recipe_id': comm.recipe_id,
            'date': comm.date
        })
    elif request.method == 'PUT':
        # check if logged in
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        # check contents of request
        try:
            body = request.body.decode()
            content = json.loads(body)['content']
        except (KeyError, JSONDecodeError) as error:
            print(error)
            return HttpResponseBadRequest()
        # check if comment exists
        try:
            comm = RecipeComment.objects.get(id=comment_id)
        except RecipeComment.DoesNotExist as error:
            print(error)
            return HttpResponse(status=404)
        # check if the user is the author
        if comm.author_id != request.user.id:
            return HttpResponse(status=403)

        comm.content = content
        comm.save()
        return JsonResponse({
            'id': comm.id,
            'content': comm.content,
            'author_id': comm.author.id,
            'author': comm.author.first_name,
            'recipe_id': comm.recipe_id,
            'date': comm.date
        })
    elif request.method == 'DELETE':
        # check if logged in
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        # check if comment exists
        try:
            comm = RecipeComment.objects.get(id=comment_id)
        except RecipeComment.DoesNotExist as error:
            print(error)
            return HttpResponse(status=404)
        # check if the user is the author
        if comm.author_id != request.user.id:
            return HttpResponse(status=403)
        comm.delete()
        return HttpResponse(status=200)
    else:
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])

def noti_list(request, user_id=0):
    '''
    [ GET ] return list of notifications (`expire` type)
            for items about to expire
            threshold: 3 days
    '''
    if request.method == 'GET':
        end_date = datetime.datetime.now() + timedelta(days=3)
        print(end_date.date())
        about_to_expire = Notification.objects.filter(
            user_id=user_id,
            noti_type='expire'
        ).filter(
            expire_date__lt=end_date.date()
        )
        buy_item = Notification.objects.filter(
            user_id=user_id,
            noti_type='buy_item'
        )
        return JsonResponse(list(chain(about_to_expire.values(), buy_item.values())), safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])

def noti_read(request, noti_id=0):
    '''
    [ PUT ] set is_read as True
    '''
    if request.method == 'PUT':
        try:
            noti = Notification.objects.get(id=noti_id)
        except Notification.DoesNotExist as error:
            print(error)
            return HttpResponse(status=404)
        noti.is_read = True
        noti.save()
        response_dict = {
            'itemcount': {
                'id': noti.item_count.id,
                'item_id': noti.item_count.item_id,
                'expiration_date': noti.item_count.expiration_date,
                'count': noti.item_count.count
            },
            'is_read': True
        }
        return JsonResponse(response_dict, status=200)
    else:
        return HttpResponseNotAllowed(['PUT'])

def initialize_sample(username):
    ''' initialize_sample_user: initialize sample items '''
    user = get_user_model()
    new_user = user.objects.get(username=username)

    milk_category = Category.objects.get(id=7)
    milk_barcode = Barcode.objects.get(barcode_num='8801115114154')
    milk = Item(name='서울우유🥛1L', container='fridge', user=new_user,
                barcode=milk_barcode, category=milk_category)
    milk.save()
    milk_itemcount = ItemCount(item=milk, expiration_date='2020/12/17', count=2)
    milk_itemcount.save()
    milk_noti = Notification(user=new_user, noti_type='expire', item_count=milk_itemcount,
                                is_read=False, expire_date='2020-12-17')
    milk_noti.save()

    other_milk_itemcount = ItemCount(item=milk, expiration_date='2020/12/30', count=3)
    other_milk_itemcount.save()
    other_milk_noti = Notification(user=new_user, noti_type='expire',
                    item_count=other_milk_itemcount, is_read=False, expire_date='2020-12-30')
    other_milk_noti.save()

    pork_category = Category.objects.get(id=13)
    pork_barcode = Barcode.objects.get(barcode_num='8809604200012')
    pork = Item(name='삼겹살🐷100g', container='fridge', user=new_user,
                    barcode=pork_barcode, category=pork_category)
    pork.save()
    pork_itemcount = ItemCount(item=pork, expiration_date='2020/12/30', count=4)
    pork_itemcount.save()
    pork_noti = Notification(user=new_user, noti_type='expire', item_count=pork_itemcount,
                            is_read=False, expire_date='2020-12-30')
    pork_noti.save()

    carrot_category = Category.objects.get(id=20)
    carrot_barcode = Barcode.objects.get(barcode_num='8801448269996')
    carrot = Item(name='당근🥕', container='fridge', user=new_user,
                    barcode=carrot_barcode, category=carrot_category)
    carrot.save()
    carrot_itemcount = ItemCount(item=carrot, expiration_date='2020/12/22', count=2)
    carrot_itemcount.save()
    carrot_noti = Notification(user=new_user, noti_type='expire', item_count=carrot_itemcount,
                            is_read=False, expire_date='2020-12-22')
    carrot_noti.save()

    onion_category = Category.objects.get(id=26)
    onion_barcode = Barcode.objects.get(barcode_num='8801062286850')
    onion = Item(name='양파🧅', container='fridge', user=new_user,
                    barcode=onion_barcode, category=onion_category)
    onion.save()
    onion_itemcount = ItemCount(item=onion, expiration_date='2020/12/24', count=2)
    onion_itemcount.save()
    onion_noti = Notification(user=new_user, noti_type='expire', item_count=onion_itemcount,
                            is_read=False, expire_date='2020-12-24')
    onion_noti.save()

    tomato_category = Category.objects.get(id=34)
    tomato_barcode = Barcode.objects.get(barcode_num='8809203720263')
    tomato = Item(name='토마토🍅', container='fridge', user=new_user,
                    barcode=tomato_barcode, category=tomato_category)
    tomato.save()
    tomato_itemcount = ItemCount(item=tomato, expiration_date='2020/12/18', count=3)
    tomato_itemcount.save()
    tomato_noti = Notification(user=new_user, noti_type='expire', item_count=tomato_itemcount,
                            is_read=False, expire_date='2020-12-18')
    tomato_noti.save()

    spaghetti_category = Category.objects.get(id=18)
    spaghetti_barcode = Barcode.objects.get(barcode_num='8809284480261')
    spaghetti = Item(name='파스타🍝100g소분', container='shelf', user=new_user,
                barcode=spaghetti_barcode, category=spaghetti_category)
    spaghetti.save()
    spaghetti_itemcount = ItemCount(item=spaghetti, expiration_date='2021/3/7', count=3)
    spaghetti_itemcount.save()
    spaghetti_noti = Notification(user=new_user, noti_type='expire', item_count=spaghetti_itemcount,
                            is_read=False, expire_date='2021-3-7')
    spaghetti_noti.save()

    ramen_category = Category.objects.get(id=87)
    ramen_barcode = Barcode.objects.get(barcode_num='8801045522838')
    ramen = Item(name='오뚜기 진짬뽕❤️', container='shelf', user=new_user,
                    barcode=ramen_barcode, category=ramen_category)
    ramen.save()
    ramen_itemcount = ItemCount(item=ramen, expiration_date='2022/4/2', count=4)
    ramen_itemcount.save()
    ramen_noti = Notification(user=new_user, noti_type='expire', item_count=ramen_itemcount,
                            is_read=False, expire_date='2022-4-2')
    ramen_noti.save()
