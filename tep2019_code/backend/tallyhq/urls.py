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

urlpatterns = [
    path(r'api/', include(router.urls)),
    path(r'api/items/', item_list, name='item-list'),
    # path(r'', index, name='index')
]
