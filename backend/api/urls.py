from django.urls import path
from . import views

urlpatterns = [
    path('item/', views.item_list, name='index'),
    path('item/user/<int:id>/', views.item_user, name='index'),
    path('item/<int:id>/count/', views.item_count_list, name='index'),
    path('token/', views.token, name='token'),
]