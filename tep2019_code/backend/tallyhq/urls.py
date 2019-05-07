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

item_detail = ItemViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

teacher_list = TeacherViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

teacher_detail = TeacherViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

teacher_update = TeacherUpdateViewSet.as_view({
    'put': 'update',
})

teacher_singles = TeacherUpdateViewSet.as_view({
    'get': 'list',
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

school_detail = SchoolViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

order_detail_all = OrderDetailViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

order_detail_single = OrderDetailViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

# validation_password_list = ValidationPasswordViewSet.as_view({
#     'get': 'list',
#     'post': 'create'
# })

# validation_password_detail = ValidationPasswordViewSet.as_view({
#     'get': 'retrieve',
#     'delete': 'destroy'
# })

user_list = UserViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

user_detail = UserViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

urlpatterns = [
    path(r'api/', include(router.urls)),
    path(r'api/items/', item_list, name='item-list'),
    path(r'api/items/<int:pk>', item_detail, name='item-detail'),
    path(r'api/teachers/', teacher_list, name='teacher-list'),
    path(r'api/teachers/<int:pk>', teacher_detail, name='teacher-detail'),
    path(r'api/teacher_singles/', teacher_singles, name='teacher-singles'),
    path(r'api/teacher_update/<int:pk>', teacher_update, name='teacher-update'),
    path(r'api/orders/', order_list, name='order-list'),
    path(r'api/orders/<int:pk>', order_detail, name='order-detail'),
    path(r'api/order_items/', order_item_list, name='order-item-list'),
    path(r'api/order_items/<int:pk>', order_item_detail, name='order-item-detail'),
    path(r'api/schools/', school_list, name='school-list'),
    path(r'api/schools/<int:pk>', school_detail, name='school-detail'),
    path(r'api/order_detail/<int:pk>',
         order_detail_single, name='order-detail-single'),
    path(r'api/order_details/',
         order_detail_all, name='order-detail-all'),
    path(r'api/waivers/', WaiverView.as_view()),
    path(r'api/waivers/<int:pk>', WaiverDetailView.as_view()),
    path(r'api/validation_passwords/',
         ValidationPasswordViewSet.as_view(), name='val-pass-list'),
    path(r'api/validation_passwords/<int:pk>',
         ValidationPasswordDetail.as_view(), name='val-pass-detail'),
    path(r'api/users/', user_list, name='user-list'),
    path(r'api/users/<int:pk>', user_detail, name='user-detail'),
    path(r'api/auth/', AuthView.as_view(), name='authenticate'),
]
