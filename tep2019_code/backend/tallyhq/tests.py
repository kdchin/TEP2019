from django.test import TestCase
from .models import *
from django.core.exceptions import ValidationError
from contextlib import contextmanager
from datetime import date


class ValidationErrorTestMixin(object):
    # adapted from https://goodcode.io/articles/django-assert-raises-validationerror/
    @contextmanager
    def assertValidationErrors(self, fields):
        """
        Assert that a validation error is raised, containing all the specified
        fields, and only the specified fields.
        """
        try:
            yield
            raise AssertionError(
                "ValidationError not raised for fields: %s" % str(fields))
        except ValidationError as e:
            self.assertEqual(set(fields), set(e.message_dict.keys()))


class ItemModelTests(ValidationErrorTestMixin, TestCase):
    def test_min_val_validations(self):
        pencils = Item.objects.create(name='pencils', max_units=0,
                                      qty_per_unit=10, unit_label_name='Packs')
        # testing validations: in this case, we expect max_units to
        # throw an error, since its max_units is 0
        with self.assertValidationErrors(['max_units']):
            pencils.full_clean()
        other_pencils = Item.objects.create(name='other_pencils', max_units=10,
                                            qty_per_unit=0, unit_label_name='Packs')
        with self.assertValidationErrors(['qty_per_unit']):
            other_pencils.full_clean()
        no_name = Item.objects.create(
            max_units=10, qty_per_unit=8, unit_label_name='Packs')
        with self.assertValidationErrors(['name']):
            no_name.full_clean()

    def test_order_association(self):
        pencils = Item.objects.create(name='pencils', max_units=8,
                                      qty_per_unit=10, unit_label_name='Packs')
        pens = Item.objects.create(
            name='pens', max_units=4, qty_per_unit=12, unit_label_name='Packs')
        order = Order.objects.create(shopping_date=date.today())

        OrderItem.objects.create(item=pencils, order=order, units_taken=4)
        OrderItem.objects.create(item=pens, order=order, units_taken=3)

        items = Item.objects.filter(orders=order)
        self.assertEqual(set(items), set([pens, pencils]))
