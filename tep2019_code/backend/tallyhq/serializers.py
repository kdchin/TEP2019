from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name')


class ItemSerializer(serializers.ModelSerializer):
    # TODO: do this for the orders class
    # user = serializers.StringRelatedField(many=False)

    class Meta:
        model = Item
        fields = ('id', 'name', 'unit_label_name',
                  'max_units', 'qty_per_unit', 'orders', 'active')
