'''urls.py: define urls'''

from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('signin/', views.signin, name='signin'),
    path('signout/', views.signout, name='signout'),
    path('user/', views.user_info, name = 'user'),
    path('item/', views.item_list, name='item_list'),
    path('itemcount_test/', views.item_count_test, name='item_count_test'),
    path('item/user/<int:user_id>/', views.item_user, name='item_user'),
    path('item/<int:item_id>/count/', views.item_count_list, name='item_count_list'),
    path('item/count/<int:item_count_id>/', views.item_count_info, name='item_count_info'),
    path('barcode/<int:barcode_num>/', views.barcode_info, name='barcode_info'),
    path('barcode/', views.barcode_list, name='barcode_list'),
    path('category/<int:category_id>/', views.category_info, name='category_info'),
    path('category/', views.category_list, name='category_list'),
    path('recipe/', views.recipe_list, name='recipe_list'),
    path('recipe/search/', views.recipe_search, name='recipe_search'),
    path('recipe/<int:recipe_id>/', views.recipe_info, name='recipe_info'),
    path('recipe/<int:recipe_id>/comment/', views.comment_list, name='comment_list'),
    path('recipe/comment/<int:comment_id>/', views.comment_info, name='comment_info'),
    path('token/', views.token, name='token'),
    path('noti/user/<int:user_id>/', views.noti_list, name='noti_list'),
    path('noti/<int:noti_id>/', views.noti_read, name='noti_read'),
]
