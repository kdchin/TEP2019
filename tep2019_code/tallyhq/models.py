from django.db import models
from django.core.validators import MinValueValidator


# Item model: (such as 'pencils')
class Item(models.Model):
    name = models.CharField(max_length=30)
    max_units = models.IntegerField(validators=[MinValueValidator(1)])
    qty_per_unit = models.IntegerField(validators=[MinValueValidator(1)])
    unit_label_name = models.CharField(max_length=15)
    active = models.BooleanField(default=True)


class School(models.Model):
    name = models.CharField(max_length=50)
    active = models.BooleanField(default=True)


class Teacher(models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=30)
    email = models.EmailField()  # TODO: need to whitelist things?
    phone = models.CharField(max_length=20)
    school = models.ForeignKey(School, on_delete=models.SET_NULL)
    active = models.BooleanField(default=True)


# Order model: one per teacher visit, summarizes what a teacher got
class Order(models.Model):
    shopping_date = models.DateField()
    uploaded = models.BooleanField(default=False)
    waiver_signed = models.BooleanField(default=False)
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL)


# ValidationPassword: the password that volunteers enter to validate the form
class ValidationPassword(models.Model):
    digest = models.CharField(max_length=30)
    date = models.DateField()
    current = models.BooleanField(default=True)
