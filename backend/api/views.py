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
    # INITIALIZING DB (TEMPORARY)
    if Category.objects.all().count() == 0 or Recipe.objects.all().count() == 0:
        initialize_category()
        initialize_recipe()
    if Barcode.objects.all().count() == 0:
        initialize_barcode()
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
        recipe_queryset = None
        if preference == 'all':
            recipe_queryset = Recipe.objects.all()
        else:
            recipe_queryset = Recipe.objects.filter(cuisine_type=preference)
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
