from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name')


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ('id', 'name', 'active')


class TeacherSerializer(serializers.ModelSerializer):
    school = SchoolSerializer(many=False, read_only=False)

    class Meta:
        model = Teacher
        fields = ('id', 'first_name', 'last_name',
                  'email', 'phone', 'school', 'active')

    def create(self, validated_data):
        school_data = validated_data.pop('school')
        school, _ = School.objects.get_or_create(**school_data)
        return Teacher.objects.create(school=school, **validated_data)


class OrderSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer(many=False, read_only=False)

    class Meta:
        model = Order
        fields = ('id', 'shopping_date', 'uploaded',
                  'waiver_signed', 'teacher')

    def create(self, validated_data):
        teacher_data = validated_data.pop('teacher')
        school_data = teacher_data.pop('school')
        school, _ = School.objects.get_or_create(**school_data)
        teacher, _ = Teacher.objects.get_or_create(
            **teacher_data, school=school)
        order, _ = Order.objects.get_or_create(
            teacher=teacher, **validated_data)
        return order


# TODO: make one-way serializers for Order and Item fhg
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('id', 'name', 'unit_label_name',
                  'max_units', 'qty_per_unit', 'active')


class OrderItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer(many=False, read_only=False)
    order = OrderSerializer(many=False, read_only=False)

    class Meta:
        model = OrderItem
        fields = ('id', 'item', 'order', 'units_taken')

    def create(self, validated_data):
        if 'id' in validated_data:
            validated_data.pop('id')
        order_data = validated_data.pop('order')
        item_data = validated_data.pop('item')
        teacher_data = order_data.pop('teacher')
        school_data = teacher_data.pop('school')
        school, _ = School.objects.get_or_create(**school_data)
        teacher, _ = Teacher.objects.get_or_create(
            **teacher_data, school=school)
        # TODO: convert to timestamp bc otherwise two orders cant be made on the same day by the same teacher
        order, _ = Order.objects.get_or_create(
            **order_data,
            teacher=teacher,
        )
        item, _ = Item.objects.get_or_create(**item_data)
        return OrderItem.objects.create(order=order, item=item, **validated_data)
