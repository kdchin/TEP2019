from django.test import TestCase
from .models import *
from django.core.exceptions import ValidationError
from contextlib import contextmanager


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
    def test_max_quantity(self):
        pencils = Item(name='pencils', max_units=0,
                       qty_per_unit=10, unit_label_name='Packs')
        with self.assertValidationErrors(['max_units']):
            pencils.full_clean()
        other_pencils = Item(name='other_pencils', max_units=10,
                             qty_per_unit=0, unit_label_name='Packs')
        with self.assertValidationErrors(['qty_per_unit']):
            other_pencils.full_clean()
        no_name = Item(max_units=10, qty_per_unit=8, unit_label_name='Packs')
        with self.assertValidationErrors(['name']):
            no_name.full_clean()
