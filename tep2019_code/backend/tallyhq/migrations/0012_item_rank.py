# Generated by Django 2.1.7 on 2019-04-21 23:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tallyhq', '0011_auto_20190421_0050'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='rank',
            field=models.IntegerField(default=0),
        ),
    ]
