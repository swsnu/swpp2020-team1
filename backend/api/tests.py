''' test.py: test the model '''

import json
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from .models import Barcode, Category, Item, ItemCount, Notification, Recipe, RecipeComment

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

        response = client.post('/back/signup/', json.dumps({'email': 'chris@cc.com', 'password': 'chris', 'nickname': 'christmas'}),
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

    def test_user_info(self):
        client = Client()
        response = client.get('/back/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        client.post('/back/signin/', json.dumps({'username': 'swpp', 'password': 'iluvswpp'}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        Barcode.objects.get(barcode_num='8801234').delete()
        response = client.get('/back/user/')
        self.assertEqual(response.status_code, 200)

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
        response = client.delete('/back/category/')
        self.assertEqual(response.status_code, 405)

    def test_put_item_count_info(self):
        client = Client()
        User = get_user_model()
        new_user = User.objects.get(id=1)  # Django default user model
        new_category = Category(name='milk')
        new_category.save()
        response = client.get('/back/token/')
        csrftoken = response.cookies['csrftoken'].value
        response = client.post('/back/signin/', json.dumps({'username': 'swpp', 'password': 'iluvswpp'}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
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

    def test_recipe_list(self):
        client = Client()
        ### GET ###
        response = client.get('/back/recipe/')
        self.assertEqual(response.status_code, 200)

        ### NOT ALLOWED ###
        response = client.put('/back/recipe/')
        self.assertEqual(response.status_code, 405)

    def test_recipe_info(self):
        User = get_user_model()
        user1 = User.objects.create_user(username='user1', password='pw1')
        cat1 = Category.objects.create(name='cat1')
        recipe1 = Recipe.objects.create(title='r1', rating_count=1, rating_sum=3)
        recipe1.rating_users.add(user1)
        recipe1.ingredients.add(cat1)
        recipe1.save()
        recipe2 = Recipe.objects.create(title='r2')
        client = Client()

        ### GET ###
        response = client.get('/back/recipe/1/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['title'], 'r1')
        # recipe with 0 rating count -> average 0
        response = client.get('/back/recipe/2/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['rating_average'], 0)
        # recipe doesn't exist
        response = client.get('/back/recipe/10/')
        self.assertEqual(response.status_code, 404)

        ### PUT ###
        # not logged in
        response = client.put('/back/recipe/1/')
        self.assertEqual(response.status_code, 401)

        client.login(username='user1', password='pw1')
        # bad request body
        response = client.put('/back/recipe/1/')
        self.assertEqual(response.status_code, 400)
        # recipe doesn't exist
        response = client.put('/back/recipe/10/', json.dumps({'rating':3}), content_type='application/json')
        self.assertEqual(response.status_code, 404)     

        # give rating
        response = client.put('/back/recipe/2/', json.dumps({'rating':3}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

        ### NOT ALLOWED ###
        response = client.delete('/back/recipe/1/')
        self.assertEqual(response.status_code, 405)

    def test_recipe_search(self):
        client = Client()
        ### POST ###
        response = client.post('/back/recipe/search/', json.dumps({'ingredients': [1], 'preference': 'korean'}),  content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = client.post('/back/recipe/search/', json.dumps({'ingredients': [1], 'preference': 'all'}),  content_type='application/json')
        self.assertEqual(response.status_code, 200)

        recipe = Recipe(title='aa', description='bb', video_url='cc', cuisine_type='korean')
        recipe.save()
        category = Category.objects.get(id=1)
        recipe.ingredients.add(category)
        recipe.save()
        response = client.post('/back/recipe/search/', json.dumps({'ingredients': [1], 'preference': 'all'}),  content_type='application/json')
        self.assertEqual(response.status_code, 200)

        ### KeyError
        response = client.post('/back/recipe/search/', json.dumps({'ingredients': [1]}),  content_type='application/json')
        self.assertEqual(response.status_code, 400)

        ### NOT ALLOWED ###
        response = client.put('/back/recipe/search/')
        self.assertEqual(response.status_code, 405)

    def test_recipe_rating(self):
        client = Client()
        response = client.get('/back/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        client.post('/back/signin/', json.dumps({'username': 'swpp', 'password': 'iluvswpp'}),
                                content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        response = client.get('/back/recipe/rating/')
        self.assertEqual(response.status_code, 200)


    def test_comment_list(self):
        User = get_user_model()
        user1 = User.objects.create_user(username='user1', password='pw1')
        Recipe.objects.create(title='r1')

        client = Client()
        ### GET ###
        response = client.get('/back/recipe/1/comment/')
        self.assertEqual(response.status_code, 200)

        ### POST ###
        # not logged in
        response = client.post('/back/recipe/1/comment/')
        self.assertEqual(response.status_code, 401)
        
        client.login(username='user1', password='pw1')
        # bad request body
        response = client.post('/back/recipe/1/comment/')
        self.assertEqual(response.status_code, 400)
        # recipe doesn't exist
        response = client.post('/back/recipe/10/comment/', json.dumps({'content':'c1'}), content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = client.post('/back/recipe/1/comment/', json.dumps({'content':'c1'}), content_type='application/json')
        self.assertEqual(response.status_code, 201)

        ### NOT ALLOWED ###
        response = client.delete('/back/recipe/1/comment/')
        self.assertEqual(response.status_code, 405)

    def test_comment_info(self):
        User = get_user_model()
        user1 = User.objects.create_user(username='user1', password='pw1')
        user2 = User.objects.create(username='user2')
        recipe1 = Recipe.objects.create(title='r1')
        recipe2 = Recipe.objects.create(title='r2')
        RecipeComment.objects.create(author=user1, recipe=recipe1)
        RecipeComment.objects.create(author=user2, recipe=recipe1)
        client = Client()

        ### GET ###
        # comment doesn't exist
        response = client.get('/back/recipe/comment/10/')
        self.assertEqual(response.status_code, 404)
        # comment exist
        response = client.get('/back/recipe/comment/1/')
        self.assertEqual(response.status_code, 200)

        ### PUT ###
        # not logged in
        response = client.put('/back/recipe/comment/1/')
        self.assertEqual(response.status_code, 401) 
        client.login(username='user1', password='pw1')
        # bad request body    
        response = client.put('/back/recipe/comment/1/')
        self.assertEqual(response.status_code, 400)
        # comment doesn't exist
        response = client.put('/back/recipe/comment/10/', json.dumps({'content':'c1'}), content_type='application/json')
        self.assertEqual(response.status_code, 404)
        # not the author
        response = client.put('/back/recipe/comment/2/', json.dumps({'content':'c1'}), content_type='application/json')
        self.assertEqual(response.status_code, 403)   
        # success
        response = client.put('/back/recipe/comment/1/', json.dumps({'content':'c1'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)        

        ### DELETE ###
        # not logged in
        client.logout()
        response = client.delete('/back/recipe/comment/1/')
        self.assertEqual(response.status_code, 401) 
        client.login(username='user1', password='pw1')
        # comment doesn't exist
        response = client.delete('/back/recipe/comment/10/')
        self.assertEqual(response.status_code, 404)
        # not the author
        response = client.delete('/back/recipe/comment/2/')
        self.assertEqual(response.status_code, 403)   
        # success
        response = client.delete('/back/recipe/comment/1/')
        self.assertEqual(response.status_code, 200)        

        ### NOT ALLOWED ###
        response = client.post('/back/recipe/comment/1/')
        self.assertEqual(response.status_code, 405)

    def test_noti_list(self):
        client = Client()
        response = client.get('/back/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.get('/back/noti/user/1/')
        self.assertEqual(response.status_code, 200)
        response = client.delete('/back/noti/user/1/')
        self.assertEqual(response.status_code, 405)

    def test_noti_read(self):
        client = Client()
        response = client.get('/back/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie

        User = get_user_model()
        new_user = User.objects.get(id=1)  # Django default user model
        new_category = Category.objects.get(id=1)
        new_barcode = Barcode.objects.get(barcode_num='8801234')

        item = Item(name='A', container='fridge', user=new_user,
                    barcode=new_barcode, category=new_category)
        itemcount = ItemCount(item=item, expiration_date='2020/12/12', count=2)
        item.save()
        itemcount.save()
        response = client.put('/back/noti/1/', 
                        content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 404)

        noti = Notification(noti_type="expire", is_read=False, expire_date="2020-12-12",
                            user=new_user, item_count=itemcount)
        noti.save()
        response = client.put('/back/noti/1/', 
                        content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['is_read'], True)

        response = client.delete('/back/noti/1/')
        self.assertEqual(response.status_code, 405)
