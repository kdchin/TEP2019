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


# TODO: change models.ts to account for school in the frontend
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
        print(teacher_data)
        school_data = teacher_data.pop('school')
        school, _ = School.objects.get_or_create(**school_data)
        teacher, _ = Teacher.objects.get_or_create(
            **teacher_data, school=school)
        order, _ = Order.objects.get_or_create(
            teacher=teacher, **validated_data)
        return order

# TODO: make one-way serializers for Order and Item
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('id', 'name', 'unit_label_name',
                  'max_units', 'qty_per_unit', 'active')


# TODO incorporate school serializer
class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ('id', 'first_name', 'last_name',
                  'email', 'phone', 'school', 'active')
