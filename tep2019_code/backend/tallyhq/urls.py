from django.urls import include, path
from rest_framework import routers
from .views import *

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'items', ItemViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path(r'api/', include(router.urls)),
    # path(r'', index, name='index')
]
