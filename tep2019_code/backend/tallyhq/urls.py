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

item_detail = ItemViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

teacher_detail = TeacherViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

order_list = OrderViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

order_detail = OrderViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

order_item_list = OrderItemViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

order_item_detail = OrderItemViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

school_list = SchoolViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

urlpatterns = [
    path(r'api/', include(router.urls)),
    path(r'api/items/', item_list, name='item-list'),
    path(r'api/items/<int:pk>', item_detail, name='item-detail'),
    path(r'api/teachers/', teacher_list, name='teacher-list'),
    path(r'api/teachers/<int:pk>', teacher_detail, name='teacher-detail'),
    path(r'api/orders/', order_list, name='order-list'),
    path(r'api/orders/<int:pk>', order_detail, name='order-detail'),
    path(r'api/order_items/', order_item_list, name='order-item-list'),
    path(r'api/order_items/<int:pk>', order_item_detail, name='order-item-detail'),
    path(r'api/schools/', school_list, name='school-list'),
    # path(r'', index, name='index')
]

