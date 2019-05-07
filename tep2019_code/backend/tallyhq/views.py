from .models import *
from .serializers import *
from .authentication import *
from .custom_perms import *
from django.shortcuts import render, HttpResponse, Http404, get_list_or_404, get_object_or_404
from rest_framework import viewsets, permissions
from django.contrib.auth.models import User
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import json
import os
import boto3
from botocore.client import Config


class ItemViewSet(viewsets.ModelViewSet):
    """
    Provides basic CRUD functions for the Item model
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherDetailSerializer
    permission_classes = (hasPasswordOrReadOnly |
                          permissions.IsAuthenticatedOrReadOnly,)


class TeacherUpdateViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = (hasPasswordOrReadOnly |
                          permissions.IsAuthenticatedOrReadOnly,)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = (hasPasswordOrReadOnly |
                          permissions.IsAuthenticatedOrReadOnly,)


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = (hasPasswordOrReadOnly |
                          permissions.IsAuthenticatedOrReadOnly,)


class SchoolViewSet(viewsets.ModelViewSet):
    """
    Provides basic CRUD functions for the Item model
    """
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)


class OrderDetailViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderDetailSerializer
    permission_classes = (hasPasswordOrReadOnly |
                          permissions.IsAuthenticatedOrReadOnly,)


class ValidationPasswordViewSet(APIView):
    """
    Provides basic CRUD functions for the Item model
    """
    queryset = ValidationPassword.objects.all()
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )

    def get(self, request, format=None):
        passwords = ValidationPassword.objects.all()
        serializer = ValidationPasswordSerializer(passwords, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = ValidationPasswordSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ValidationPasswordDetail(APIView):

    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )

    def get_object(self, pk):
        try:
            obj = get_object_or_404(ValidationPassword, pk=pk)
            self.check_object_permissions(self.request, obj)
            return obj
        except ValidationPassword.DoesNotExist:
            raise Http404

    def delete(self, request, pk, format=None):
        pwd = self.get_object(pk)
        pwd.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class WaiverView(APIView):
    parser_class = (FileUploadParser,)
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )

    def get(self, request, format=None):
        waivers = Waiver.objects.all()
        serializer = WaiverSerializer(waivers, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):

        file_serializer = WaiverSerializer(data=request.data)

        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WaiverDetailView(APIView):
    parser_class = (FileUploadParser,)
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )

    def get_object(self, pk):
        try:
            return Waiver.objects.get(pk=pk)
        except Waiver.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = WaiverSerializer(snippet)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = WaiverSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        waiver = self.get_object(pk)
        waiver.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserViewSet(viewsets.ModelViewSet):
    """
    Provides basic CRUD functions for the Item model
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )


class AuthView(APIView):
    authentication_classes = (QuietBasicAuthentication,)
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        return Response(self.serializer_class(request.user).data)
