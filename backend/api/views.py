from django.http import HttpResponse, JsonResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
import json
from json import JSONDecodeError
from .models import Category, Barcode, Item, ItemCount

# Create your views here.

def signup(request):
    if request.method == 'POST':
        try:
            req_data = json.loads(request.body.decode())
            username = req_data['username']
            password = req_data['password']
        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest()
        User.objects.create_user(username=username, password=password)
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['POST'])

def signin(request):
    if request.method == 'POST':
        try:
            req_data = json.loads(request.body.decode())
            username = req_data['username']
            password = req_data['password']
        except (KeyError, JSONDecodeError) as e:
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
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])

def item_count_test(request): # TODO: this api is for debugging.
    if request.method == 'GET':
        item_count_list = [itemcount for itemcount in ItemCount.objects.all().values()]
        return JsonResponse(item_count_list, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])

def item_list(request):
    if request.method == 'GET':
        item_list = [item for item in Item.objects.all().values()]
        return JsonResponse(item_list, safe=False)
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        # TODO: check if the user is authenticated
        try:
            body = request.body.decode()
            name = json.loads(body)['name']
            container = json.loads(body)['container']
            category_id = json.loads(body)['category_id']
            barcode_num = json.loads(body)['barcode_num']
            expiration_date = json.loads(body)['expiration_date']
            count = json.loads(body)['count']
            user = request.user
        except (KeyError, JSONDecodeError) as e:
            print(e)
            return HttpResponseBadRequest()
        
        barcode = Barcode.objects.filter(barcode_num=barcode_num).first() if barcode_num else None
        category = Category.objects.filter(id=category_id).first() if category_id else None

        result_str = ''

        item_dup = Item.objects.filter(user_id=user.id, barcode__barcode_num=barcode_num)
        if item_dup.count() == 1:
            # record with same user_id and barcode_num exists.
            same_item = item_dup[0]
            same_item.name = name
            same_item.container = container
            same_item.category = category
            same_item.barcode = barcode
            same_item.save()
            item_count_dup = ItemCount.objects.filter(item_id=same_item.id, expiration_date=expiration_date) 
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
            if barcode != None:
                # barcode number is provided. create a new item and item_count
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
                    item_count_dup = ItemCount.objects.filter(item_id=same_item.id, expiration_date=expiration_date)
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
        if result_str == '':
            result_str = 'Failed: something wrong'
        response_dict = {
            'result_str': result_str
        }
        return HttpResponse(json.dumps(response_dict), status=201, content_type='application/json')
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])
    return

def item_user(request, id=0):
    if request.method == 'GET':
        # TODO: check user existence
        item_list = [item for item in Item.objects.filter(user_id = id).values()]
        return JsonResponse(item_list, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])

def item_count_list(request, id=0):
    if request.method == 'GET':
        item_count_list = [item_count for item_count in ItemCount.objects.filter(item_id = id).values()]
        return JsonResponse(item_count_list, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])