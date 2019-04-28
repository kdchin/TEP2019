from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from django.utils import timezone


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ('id', 'name', 'active')


class WaiverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Waiver
        fields = ('id', 'file', 'uploaded_date')


class TeacherSerializer(serializers.ModelSerializer):
    school = SchoolSerializer(many=False, read_only=False)

    class Meta:
        model = Teacher
        fields = ('id', 'first_name', 'last_name', 'address',
                  'email', 'phone', 'school', 'active')
        extra_kwargs = {
            'email': {
                'validators': []
            }
        }

    def create(self, validated_data):
        school_data = validated_data.pop('school')
        school, _ = School.objects.get_or_create(**school_data)
        return Teacher.objects.create(school=school, **validated_data)

    def update(self, instance, validated_data):
        school_data = validated_data.pop('school')
        school, _ = School.objects.get_or_create(**school_data)
        instance.school = school
        print("data", validated_data)
        instance.first_name = validated_data.get(
            'first_name', instance.first_name)
        instance.last_name = validated_data.get(
            'last_name', instance.last_name)
        instance.address = validated_data.get('address', instance.address)
        instance.email = validated_data.get('email', instance.email)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.active = validated_data.get('active', instance.active)
        instance.save()
        return instance


class OrderTeacherSerializer(serializers.ModelSerializer):
    waiver = WaiverSerializer(many=False, read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'checkout_time', 'uploaded', 'waiver')


class TeacherDetailSerializer(serializers.ModelSerializer):
    orders = OrderTeacherSerializer(
        many=True, source='order_set', read_only=True)
    school = SchoolSerializer(many=False, read_only=False)

    def create(self, validated_data):
        school_data = validated_data.pop('school')
        school, _ = School.objects.get_or_create(**school_data)
        return Teacher.objects.create(school=school, **validated_data)

    class Meta:
        model = Teacher
        fields = ('id', 'first_name', 'last_name', 'address',
                  'email', 'phone', 'school', 'orders', 'active')
        extra_kwargs = {
            'email': {
                'validators': []
            }
        }


class OrderSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer(many=False, read_only=False)
    waiver = WaiverSerializer(many=False, read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'checkout_time', 'uploaded', 'waiver', 'teacher')

    def create(self, validated_data):
        teacher_data = validated_data.pop('teacher')
        school_data = teacher_data.pop('school')
        if 'waiver' in validated_data:
            waiver_data = validated_data.pop('waiver')
            waiver, _ = Waiver.objects.get_or_create(**waiver_data)
        else:
            waiver = Waiver.objects.latest('uploaded_date')
        school, _ = School.objects.get_or_create(**school_data)
        teacher, _ = Teacher.objects.get_or_create(
            **teacher_data, school=school)
        order, _ = Order.objects.get_or_create(checkout_time=timezone.now(), waiver=waiver,
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
                  'max_units', 'qty_per_unit', 'active', 'rank')


class OrderItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer(many=False, read_only=False)
    order = OrderSerializer(many=False, read_only=False)

    class Meta:
        model = OrderItem
        fields = ('id', 'item', 'order', 'units_taken')

    def create(self, validated_data):
        order_data = validated_data.pop('order')
        item_data = validated_data.pop('item')
        teacher_data = order_data.pop('teacher')
        school_data = teacher_data.pop('school')
        if 'waiver' in order_data:
            waiver_data = order_data.pop('waiver')
            waiver, _ = Waiver.objects.get_or_create(**waiver_data)
        else:
            waiver = Waiver.objects.latest('uploaded_date')
        school, _ = School.objects.get_or_create(**school_data)
        teacher, _ = Teacher.objects.get_or_create(
            **teacher_data, school=school)
        order, _ = Order.objects.get_or_create(
            **order_data,
            teacher=teacher,
            waiver=waiver,
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
    waiver = WaiverSerializer(many=False, read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'checkout_time', 'uploaded',
                  'waiver', 'teacher', 'order_items')


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
