''' views.py: define views '''


import json
from json import JSONDecodeError
from django.http import HttpResponse, JsonResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import get_user_model
from .models import Category, Barcode, Item, ItemCount

# Create your views here.

def signup(request):
    '''
    signup:
        POST: create user
    '''
    if request.method == 'POST':
        try:
            req_data = json.loads(request.body.decode())
            username = req_data['username']
            password = req_data['password']
        except (KeyError, JSONDecodeError) as error:
            print(error)
            return HttpResponseBadRequest()
        user = get_user_model()
        user.objects.create_user(username=username, password=password)
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
                result_str = 'Success: item found with barcode_num, item_count found'
            elif item_count_dup.count() == 0:
                # item_count with same expiration date doesn't exists, create a new record
                new_item_count = ItemCount(
                    item=same_item,
                    expiration_date=expiration_date,
                    count=count,
                )
                new_item_count.save()
                result_str = 'Success: item found with barcode_num, item_count created'
            else:
                print("Something wrong. Duplicate item_counts in ItemCount model.")
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
                result_str = 'Success: item created with barcode_num, item_count created'
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
                        result_str = 'Success: item found with item name, item_count found'
                    elif item_count_dup.count() == 0:
                        # item_count with same expiration date doesn't exists, create a new record
                        new_item_count = ItemCount(
                            item=same_item,
                            expiration_date=expiration_date,
                            count=count,
                        )
                        new_item_count.save()
                        result_str = 'Success: item found with item name, item_count created'
                    else:
                        print("Something wrong. Duplicate item_counts in ItemCount model.")
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
                    result_str = 'Success: item created with item name, item_count created'
                else:
                    print("Something wrong. Duplicate items in Item model.")
        else:
            print("Somthing wrong. Duplicate items in Item model.")
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
            response_dict['item_count_found'] = True
            response_dict['item_count'] = {
                'id': same_item_count.id,
                'item_id': same_item_count.item_id,
                'expiration_date': same_item_count.expiration_date,
                'count': same_item_count.count
            }
        elif new_item_count is not None:
            response_dict['item_count_found'] = False
            response_dict['item_count'] = {
                'id': new_item_count.id,
                'item_id': new_item_count.item_id,
                'expiration_date': new_item_count.expiration_date,
                'count': new_item_count.count
            }
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

def item_count_info(request, item_count_id=0):
    '''
    item_count_info:
        PUT: modify count of the item_count
    '''
    if request.method == 'PUT':
        is_deleted = False
        try:
            item_count = ItemCount.objects.get(id=item_count_id)
        except ItemCount.DoesNotExist as error:
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
        elif count == 0:
            item_count.delete()
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
                'item_count': {
                    'id': item_count.id,
                    'item_id': item_count.item_id,
                    'expiration_date': item_count.expiration_date,
                    'count': item_count.count
                }
            }
        return JsonResponse(response_dict, status=200)
    else:
        return HttpResponseNotAllowed(['PUT'])
