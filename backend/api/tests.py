''' test.py: test the model '''

import json
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from .models import Barcode, Category, Item, ItemCount, Notification

class ApiTestCase(TestCase):
    def test_csrf(self):
        # By default, csrf checks are disabled in test client
        # To test csrf protection we enforce csrf checks here
        client = Client(enforce_csrf_checks=True)
        response = client.post('/back/signup/', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 403)  # Request without csrf token returns 403

        response = client.get('/back/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie

        response = client.post('/back/signup/', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)  # Pass csrf protection
        response = client.post('/back/token/', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405)

    def setUp(self):
        User = get_user_model()
        new_user = User.objects.create_user(username='swpp', password='iluvswpp')
        new_category = Category(name='milk')
        new_category.save()
        new_barcode = Barcode(barcode_num='8801234', item_name='seoul_milk', category=new_category)
        new_barcode.save()
        # new_item = Item(name="Seoul milk 200ml", container="fridge",
        #                 user=new_user, category=new_category, barcode=new_barcode)
        # new_item_count = ItemCount(expiration_date="2020/11/30", count=3, item=new_item)

    def test_illegal_signup(self):
        client = Client()
        response = client.get('/back/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.put('/back/signup/', 
                        json.dumps({'username': 'swpp2', 'password': 'iluvswpp2'}),
                        content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405)
        response = client.post('/back/signup/', json.dumps({'username': 'swpp2'}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 400)

    def test_illegal_signin(self):        
        client = Client()
        response = client.get('/back/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.put('/back/signin/', json.dumps({'username': 'swpp2', 'password': 'iluvswpp2'}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405)
        response = client.post('/back/signin/', json.dumps({'username': 'swpp2'}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 400)
        response = client.post('/back/signin/', json.dumps({'username': 'swpp3', 'password': 'wrongpassword'}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 401)

    def test_signout(self):        
        client = Client()
        response = client.get('/back/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.post('/back/signin/', json.dumps({'username': 'swpp', 'password': 'iluvswpp'}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.get('/back/signout/')
        self.assertEqual(response.status_code, 204)
        response = client.get('/back/signout/')
        self.assertEqual(response.status_code, 401)
        response = client.delete('/back/signout/')
        self.assertEqual(response.status_code, 405)

    def test_get_item(self):
        client = Client()
        response = client.get('/back/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.get('/back/item/')
        self.assertEqual(response.status_code, 200)
        response = client.delete('/back/item/')
        self.assertEqual(response.status_code, 405)
    
    def test_post_item(self):        
        client = Client()
        response = client.get('/back/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.post('/back/item/', json.dumps({
            'name': 'aa',
            'container': 'fridge',
            'category_id': 1,
            'barcode_num': '8801234',
            'expiration_date': '2020/11/29',
            'count': 3,}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 401)
        response = client.post('/back/signin/', json.dumps({'username': 'swpp', 'password': 'iluvswpp'}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.post('/back/item/', json.dumps({
            'name': 'aa',
            'container': 'fridge',
            'category_id': 1,
            'barcode_num': '8801234',
            'expiration_date': '2020/11/29',
            'count': 3,}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        response = client.post('/back/item/', json.dumps({
            'name': 'aa',
            'container': 'fridge',
            'category_id': 1,
            'barcode_num': '8801234',
            'expiration_date': '2020/11/30',
            'count': 3,}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        response = client.post('/back/item/', json.dumps({
            'name': 'aa',
            'container': 'fridge',
            'category_id': 1,
            'barcode_num': '8801234',
            'expiration_date': '2020/11/30',
            'count': 3,}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        response = client.post('/back/item/', json.dumps({
            'name': 'aa',
            'container': 'fridge',
            'category_id': 1,
            'barcode_num': '8801235',
            'expiration_date': '2020/11/30',
            'count': 3,}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        response = client.post('/back/item/', json.dumps({
            'name': 'aa',
            'container': 'fridge',
            'category_id': 1,
            'barcode_num': '8801235',
            'expiration_date': '2020/11/30',
            'count': 3,}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        response = client.post('/back/item/', json.dumps({
            'name': 'aa',
            'container': 'fridge',
            'category_id': 1,
            'barcode_num': '8801235',
            'expiration_date': '2020/11/28',
            'count': 3,}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        response = client.post('/back/item/', json.dumps({
            'category_id': 1,
            'barcode_num': '8801234',
            'expiration_date': '2020/11/29',
            'count': 3,}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 400)

    def test_get_item_user(self):
        client = Client()
        response = client.get('/back/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.get('/back/item/user/1/')
        self.assertEqual(response.status_code, 200)
        response = client.delete('/back/item/user/1/')
        self.assertEqual(response.status_code, 405)

    def test_get_item_count_test(self):
        client = Client()
        response = client.get('/back/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.get('/back/itemcount_test/')
        self.assertEqual(response.status_code, 200)
        response = client.delete('/back/itemcount_test/')
        self.assertEqual(response.status_code, 405)

    def test_get_item_count_list(self):
        client = Client()
        response = client.get('/back/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.get('/back/item/1/count/')
        self.assertEqual(response.status_code, 200)
        response = client.delete('/back/item/1/count/')
        self.assertEqual(response.status_code, 405)

    def test_get_barcode(self):
        client = Client()
        response = client.get('/back/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.get('/back/barcode/8801234/')
        self.assertEqual(response.status_code, 200)
        response = client.get('/back/barcode/8801357/')
        self.assertEqual(response.status_code, 404)
        response = client.delete('/back/barcode/8801357/')
        self.assertEqual(response.status_code, 405)

    def test_post_barcode(self):
        client = Client()
        response = client.get('/back/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.post('/back/barcode/', json.dumps({
                'barcode_num': '1111',
                'item_name': 'aaa',
                'category_id': 1,
            }), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        response = client.post('/back/barcode/', json.dumps({
                'barcode_num': '2222',
                'category_id': 1
            }), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 400)
        response = client.get('/back/barcode/')
        self.assertEqual(response.status_code, 405)

    def test_get_category(self):
        client = Client()
        response = client.get('/back/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.get('/back/category/1/')
        self.assertEqual(response.status_code, 200)
        response = client.get('/back/category/2/')
        self.assertEqual(response.status_code, 404)
        response = client.delete('/back/category/1/')
        self.assertEqual(response.status_code, 405)

    def test_post_category(self):
        client = Client()
        response = client.get('/back/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.post('/back/category/', json.dumps({
                'name': 'aaa',
            }), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        response = client.post('/back/category/', json.dumps({
                'barcode_num': '2222',
            }), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 400)
        response = client.get('/back/category/')
        self.assertEqual(response.status_code, 405)

    def test_put_item_count_info(self):
        client = Client()
        User = get_user_model()
        new_user = User.objects.get(id=1)  # Django default user model
        new_category = Category(name='milk')
        new_category.save()
        response = client.get('/back/token/')
        csrftoken = response.cookies['csrftoken'].value 
        new_barcode = Barcode(barcode_num='8801234', item_name='seoul_milk', category=new_category)
        new_barcode.save()
        item = Item(name='A', container='fridge', user=new_user,
                    barcode=new_barcode, category=new_category)
        itemcount = ItemCount(item=item, expiration_date='2020/12/12', count=2)
        noti = Notification(noti_type="expire", is_read=False, expire_date="2020-12-12",
                            user=new_user, item_count=itemcount)
        item.save()
        itemcount.save()
        noti.save()

        response = client.put('/back/item/count/1/', json.dumps({
                'count': 1
            }), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)
        response = client.put('/back/item/count/2/', json.dumps({
                'count': 1
            }), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 404)
        response = client.put('/back/item/count/1/', json.dumps({
                'cot': 1
            }), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 400)
        response = client.put('/back/item/count/1/', json.dumps({
                'count': 0
            }), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)
        response = client.put('/back/item/count/1/', json.dumps({
                'count': -1
            }), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 404)
        response = client.get('/back/item/count/1/')
        self.assertEqual(response.status_code, 405)
