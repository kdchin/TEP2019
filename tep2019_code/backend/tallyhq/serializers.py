from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name')


# TODO incorporate school serializer
class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ('id', 'first_name', 'last_name',
                  'email', 'phone', 'school', 'active')


class OrderSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer(many=False, read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'shopping_date', 'uploaded',
                  'waiver_signed', 'teacher')


# TODO: make one-way serializers for Order and Item fhg
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('id', 'name', 'unit_label_name',
                  'max_units', 'qty_per_unit', 'orders', 'active')


class OrderItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer(many=False, read_only=True)
    order = OrderSerializer(many=False, read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'item', 'order', 'units_taken')


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ('id', 'name', 'active')
