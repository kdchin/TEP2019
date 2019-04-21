from django.db import models
from django.core.validators import MinValueValidator


class Item(models.Model):
    # title of item (e.g. 'pencils')
    name = models.CharField(max_length=30)

    # display label for unites (e.g. 'packs')
    unit_label_name = models.CharField(max_length=15)

    # maximum number of units that can be taken for this item
    max_units = models.IntegerField(validators=[MinValueValidator(1)])

    # number of the item per unit (e.g. 8 (pencils per pack))
    qty_per_unit = models.IntegerField(validators=[MinValueValidator(1)])

    # also has attribute: 'orders' as defined by ManyToMany in Order

    # whether or not the item is active.
    active = models.BooleanField(default=True)

    # order of item in the orderItem list
    rank = models.IntegerField(default=0)


class School(models.Model):
    name = models.CharField(max_length=50)
    active = models.BooleanField(default=True)

    # TODO: maybe add in name as unique?


class Teacher(models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=30)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    school = models.ForeignKey(School, on_delete=models.CASCADE, null=False)
    active = models.BooleanField(default=True)

    # TODO: make email unique


class Waiver(models.Model):
    file = models.FileField(blank=True, default='')
    uploaded_date = models.DateTimeField(auto_now_add=True, blank=True)


# Order model: one per teacher visit, summarizes what a teacher got
class Order(models.Model):
    # date the teacher visited TEP
    shopping_date = models.DateTimeField(auto_now_add=True, blank=True)

    # whether this order has been exported to csv yet
    uploaded = models.BooleanField(default=False)

    # the waiver they signed
    waiver = models.ForeignKey(Waiver, on_delete=models.CASCADE, null=False)

    # teacher associated with the order
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, null=False)

    # each order has many items, and many items are in many orders
    items = models.ManyToManyField(
        Item, through='OrderItem', related_name='orders')


# Associative entity for order and item
class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, related_name='order_items', on_delete=models.CASCADE, null=False)
    item = models.ForeignKey(
        Item, related_name='order_items', on_delete=models.CASCADE, null=False)

    # how many units of an item a teacher took (e.g. 8 (packs))
    units_taken = models.IntegerField(validators=[MinValueValidator(0)])


# ValidationPassword: the password that volunteers/TEP employees enter to validate the form
class ValidationPassword(models.Model):
    digest = models.CharField(max_length=50)
    uploaded_date = models.DateTimeField(auto_now_add=True, blank=True)
