from .models import *
from .serializers import *
from django.shortcuts import render
from rest_framework import viewsets, permissions
from django.contrib.auth.models import User


# def index(request, path=''):
#     return render(request, 'index.html')


class UserViewSet(viewsets.ModelViewSet):
    """
    Provides basic CRUD functions for the User model
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = (permissions.IsAuthenticatedOrReadOnly, )


class ItemViewSet(viewsets.ModelViewSet):
    """
    Provides basic CRUD functions for the Item model
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    # TODO: authenticate with admin user (cat)
    # permission_classes = (permissions.IsAuthenticatedOrReadOnly, )

    # def perform_create(self, serializer):
    #     serializer.save(user=self.request.user)


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer


class SchoolViewSet(viewsets.ModelViewSet):
    """
    Provides basic CRUD functions for the Item model
    """
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
