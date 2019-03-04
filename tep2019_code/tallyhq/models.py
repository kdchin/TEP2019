from django.db import models
from django.core.validators import MinValueValidator


# Item model: (such as 'pencils')
class Item(models.Model):
    name = models.CharField(max_length=30)
    max_units = models.IntegerField(validators=[MinValueValidator(1)])
    qty_per_unit = models.IntegerField(validators=[MinValueValidator(1)])
    unit_label_name = models.CharField(max_length=15)
