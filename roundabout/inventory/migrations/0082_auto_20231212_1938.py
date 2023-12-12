# Generated by Django 3.1.3 on 2023-12-12 19:38

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0081_auto_20221121_2151'),
    ]

    operations = [
        migrations.AddField(
            model_name='deployment',
            name='surveyed_latitude',
            field=models.DecimalField(blank=True, decimal_places=7, max_digits=10, null=True, validators=[django.core.validators.MaxValueValidator(90), django.core.validators.MinValueValidator(-90)]),
        ),
        migrations.AddField(
            model_name='deployment',
            name='surveyed_ldepth',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='deployment',
            name='surveyed_longitude',
            field=models.DecimalField(blank=True, decimal_places=7, max_digits=10, null=True, validators=[django.core.validators.MaxValueValidator(180), django.core.validators.MinValueValidator(-180)]),
        ),
        migrations.AlterField(
            model_name='deployment',
            name='depth',
            field=models.PositiveIntegerField(blank=True, null=True, verbose_name='Drop Depth'),
        ),
        migrations.AlterField(
            model_name='deployment',
            name='latitude',
            field=models.DecimalField(blank=True, decimal_places=7, max_digits=10, null=True, validators=[django.core.validators.MaxValueValidator(90), django.core.validators.MinValueValidator(-90)], verbose_name='Drop Latitude'),
        ),
        migrations.AlterField(
            model_name='deployment',
            name='longitude',
            field=models.DecimalField(blank=True, decimal_places=7, max_digits=10, null=True, validators=[django.core.validators.MaxValueValidator(180), django.core.validators.MinValueValidator(-180)], verbose_name='Drop Longitude'),
        ),
    ]
