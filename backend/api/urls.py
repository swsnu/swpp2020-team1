'''urls.py: define urls'''

from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('signin/', views.signin, name='signin'),
    path('signout/', views.signout, name='signout'),
    path('item/', views.item_list, name='item_list'),
    path('itemcount_test/', views.item_count_test, name='item_count_test'),
    path('item/user/<int:user_id>/', views.item_user, name='item_user'),
    path('item/<int:item_id>/count/', views.item_count_list, name='item_count_list'),
    path('item/count/<int:item_count_id>/', views.item_count_info, name='item_count_info'),
    path('token/', views.token, name='token'),
]
