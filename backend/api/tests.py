''' test.py: test the model '''

import json
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from .models import Barcode, Category, Item, ItemCount

class ApiTestCase(TestCase):
    def test_csrf(self):
        # By default, csrf checks are disabled in test client
        # To test csrf protection we enforce csrf checks here
        client = Client(enforce_csrf_checks=True)
        response = client.post('/signup/', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 403)  # Request without csrf token returns 403

        response = client.get('/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie

        response = client.post('/signup/', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)  # Pass csrf protection
        response = client.post('/token/', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405)

    def setUp(self):
        User = get_user_model()
        new_user = User.objects.create_user(username='swpp', password='iluvswpp')
        new_category = Category(name='milk')
        new_category.save()
        new_barcode = Barcode(barcode_num='8801234', item_name='seoul_milk', category=new_category)
        new_barcode.save()


    def test_illegal_signup(self):
        client = Client()
        response = client.get('/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.put('/signup/', 
                        json.dumps({'username': 'swpp2', 'password': 'iluvswpp2'}),
                        content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405)
        response = client.post('/signup/', json.dumps({'username': 'swpp2'}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 400)

    def test_illegal_signin(self):        
        client = Client()
        response = client.get('/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.put('/signin/', json.dumps({'username': 'swpp2', 'password': 'iluvswpp2'}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405)
        response = client.post('/signin/', json.dumps({'username': 'swpp2'}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 400)
        response = client.post('/signin/', json.dumps({'username': 'swpp3', 'password': 'wrongpassword'}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 401)

    def test_signout(self):        
        client = Client()
        response = client.get('/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.post('/signin/', json.dumps({'username': 'swpp', 'password': 'iluvswpp'}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.get('/signout/')
        self.assertEqual(response.status_code, 204)
        response = client.get('/signout/')
        self.assertEqual(response.status_code, 401)
        response = client.delete('/signout/')
        self.assertEqual(response.status_code, 405)

    def test_get_item(self):
        client = Client()
        response = client.get('/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.get('/item/')
        self.assertEqual(response.status_code, 200)
        response = client.delete('/item/')
        self.assertEqual(response.status_code, 405)
    
    def test_post_item(self):        
        client = Client()
        response = client.get('/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.post('/item/', json.dumps({
            'name': 'aa',
            'container': 'fridge',
            'category_id': 1,
            'barcode_num': '8801234',
            'expiration_date': '2020/11/29',
            'count': 3,}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 401)
        response = client.post('/signin/', json.dumps({'username': 'swpp', 'password': 'iluvswpp'}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.post('/item/', json.dumps({
            'name': 'aa',
            'container': 'fridge',
            'category_id': 1,
            'barcode_num': '8801234',
            'expiration_date': '2020/11/29',
            'count': 3,}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        response = client.post('/item/', json.dumps({
            'name': 'aa',
            'container': 'fridge',
            'category_id': 1,
            'barcode_num': '8801234',
            'expiration_date': '2020/11/30',
            'count': 3,}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        response = client.post('/item/', json.dumps({
            'name': 'aa',
            'container': 'fridge',
            'category_id': 1,
            'barcode_num': '8801234',
            'expiration_date': '2020/11/30',
            'count': 3,}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        response = client.post('/item/', json.dumps({
            'name': 'aa',
            'container': 'fridge',
            'category_id': 1,
            'barcode_num': '8801235',
            'expiration_date': '2020/11/30',
            'count': 3,}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        response = client.post('/item/', json.dumps({
            'name': 'aa',
            'container': 'fridge',
            'category_id': 1,
            'barcode_num': '8801235',
            'expiration_date': '2020/11/30',
            'count': 3,}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        response = client.post('/item/', json.dumps({
            'name': 'aa',
            'container': 'fridge',
            'category_id': 1,
            'barcode_num': '8801235',
            'expiration_date': '2020/11/28',
            'count': 3,}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        response = client.post('/item/', json.dumps({
            'category_id': 1,
            'barcode_num': '8801234',
            'expiration_date': '2020/11/29',
            'count': 3,}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 400)

    def test_get_item_user(self):
        client = Client()
        response = client.get('/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.get('/item/user/1/')
        self.assertEqual(response.status_code, 200)
        response = client.delete('/item/user/1/')
        self.assertEqual(response.status_code, 405)

    def test_get_item_count_test(self):
        client = Client()
        response = client.get('/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.get('/itemcount_test/')
        self.assertEqual(response.status_code, 200)
        response = client.delete('/itemcount_test/')
        self.assertEqual(response.status_code, 405)

    def test_get_item_count_list(self):
        client = Client()
        response = client.get('/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.get('/item/1/count/')
        self.assertEqual(response.status_code, 200)
        response = client.delete('/item/1/count/')
        self.assertEqual(response.status_code, 405)

    def test_get_barcode(self):
        client = Client()
        response = client.get('/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.get('/barcode/8801234/')
        self.assertEqual(response.status_code, 200)
        response = client.get('/barcode/8801357/')
        self.assertEqual(response.status_code, 404)
        response = client.delete('/barcode/8801357/')
        self.assertEqual(response.status_code, 405)

    def test_post_barcode(self):
        client = Client()
        response = client.get('/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.post('/barcode/', json.dumps({
                'barcode_num': '1111',
                'item_name': 'aaa',
                'category_id': 1,
            }), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        response = client.post('/barcode/', json.dumps({
                'barcode_num': '2222',
                'category_id': 1
            }), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 400)
        response = client.get('/barcode/')
        self.assertEqual(response.status_code, 405)

    def test_get_category(self):
        client = Client()
        response = client.get('/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.get('/category/1/')
        self.assertEqual(response.status_code, 200)
        response = client.get('/category/2/')
        self.assertEqual(response.status_code, 404)
        response = client.delete('/category/1/')
        self.assertEqual(response.status_code, 405)

    def test_post_category(self):
        client = Client()
        response = client.get('/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.post('/category/', json.dumps({
                'name': 'aaa',
            }), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)
        response = client.post('/category/', json.dumps({
                'barcode_num': '2222',
            }), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 400)
        response = client.get('/category/')
        self.assertEqual(response.status_code, 405)

    def test_put_item_count_info(self):
        client = Client()
        User = get_user_model()
        new_user = User.objects.get(id=1)  # Django default user model
        new_category = Category(name='milk')
        new_category.save()
        response = client.get('/token/')
        csrftoken = response.cookies['csrftoken'].value 
        new_barcode = Barcode(barcode_num='8801234', item_name='seoul_milk', category=new_category)
        new_barcode.save()
        item = Item(name='A', container='fridge', user=new_user,
                    barcode=new_barcode, category=new_category)
        itemcount = ItemCount(item=item, expiration_date='2020/12/12', count=2)
        item.save()
        itemcount.save()
        response = client.put('/item/count/1/', json.dumps({
                'count': 1
            }), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)
        response = client.put('/item/count/2/', json.dumps({
                'count': 1
            }), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 404)
        response = client.put('/item/count/1/', json.dumps({
                'cot': 1
            }), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 400)
        response = client.put('/item/count/1/', json.dumps({
                'count': 0
            }), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)
        response = client.put('/item/count/1/', json.dumps({
                'count': -1
            }), content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 404)
        response = client.get('/item/count/1/')
        self.assertEqual(response.status_code, 405)
