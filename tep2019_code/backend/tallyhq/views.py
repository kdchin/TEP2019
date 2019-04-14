from .models import *
from .serializers import *
from .authentication import *
from django.shortcuts import render, HttpResponse
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


class ValidationPasswordViewSet(viewsets.ModelViewSet):
    """
    Provides basic CRUD functions for the Item model
    """
    queryset = ValidationPassword.objects.all()
    serializer_class = ValidationPasswordSerializer


class WaiverView(APIView):
    parser_class = (FileUploadParser,)

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


class AuthView(APIView):
    authentication_classes = (QuietBasicAuthentication,)
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        return Response(self.serializer_class(request.user).data)


def sign_s3(request):
    S3_BUCKET = os.environ.get('S3_BUCKET')

    file_name = request.GET['file_name']

    s3 = boto3.client('s3')

    presigned_post = s3.generate_presigned_post(
        Bucket=S3_BUCKET,
        Key=file_name,
        Fields={"acl": "public-read", "Content-Type": "application/pdf"},
        Conditions=[
            {"acl": "public-read"},
            {"Content-Type": "application/pdf"}
        ],
        ExpiresIn=3600
    )

    result = json.dumps({
        'data': presigned_post,
        'url': 'https://%s.s3.amazonaws.com/%s' % (S3_BUCKET, file_name)
    })
    return HttpResponse(result, content_type="application/json")
