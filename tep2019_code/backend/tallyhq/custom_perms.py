from rest_framework import permissions
from .models import ValidationPassword


class hasPasswordOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'DELETE':
            return False
        if request.method in permissions.SAFE_METHODS:
            return True

        pwd = ValidationPassword.objects.latest('uploaded_date')
        guess = request.META.get('HTTP_VAL_PASSWORD')
        return guess and guess == pwd.hash_digest
