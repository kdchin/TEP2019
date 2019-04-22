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

    def update(self, instance, validated_data):
        if (instance.uploaded):
            return instance
        instance.uploaded = validated_data.get('uploaded', instance.uploaded)
        instance.save()
        return instance


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

class OrderItemDetailSerializer(serializers.ModelSerializer):
    item = ItemSerializer(many=False, read_only=False)

    class Meta:
        model = OrderItem
        fields = ('id', 'item', 'units_taken')

class OrderDetailSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer(many=False, read_only=False)
    order_items = OrderItemDetailSerializer(many=True, read_only=False)

    class Meta:
        model = Order
        fields = ('id', 'shopping_date', 'uploaded',
                  'waiver_signed', 'teacher', 'order_items')

class WaiverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Waiver
        fields = ('id', 'file', 'uploaded_date')


class ValidationPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValidationPassword
        fields = ('id', 'uploaded_date', 'digest')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'password', 'username')
        write_only_fields = ('password',)
        read_only_fields = ('is_superuser',)

    def restore_object(self, attrs, instance=None):
        # call set_password on user object. Without this
        # the password will be stored in plain text.
        user = super(UserSerializer, self).restore_object(attrs, instance)
        user.set_password(attrs['password'])
        return user
