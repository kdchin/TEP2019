from django.urls import include, path
from rest_framework import routers
from .views import *

router = routers.DefaultRouter(trailing_slash=False)
# router.register(r'items', ItemViewSet)
# router.register(r'users', UserViewSet)

item_list = ItemViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

teacher_list = TeacherViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

order_list = OrderViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

order_item_list = OrderItemViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

urlpatterns = [
    path(r'api/', include(router.urls)),
    path(r'api/items/', item_list, name='item-list'),
    path(r'api/teachers/', teacher_list, name='teacher-list'),
    path(r'api/orders/', order_list, name='order-list'),
    path(r'api/order_items/', order_item_list, name='order-item-list'),
    # path(r'', index, name='index')
]
