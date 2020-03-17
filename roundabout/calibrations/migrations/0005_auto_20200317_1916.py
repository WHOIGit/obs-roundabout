# Generated by Django 2.2.9 on 2020-03-17 19:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calibrations', '0004_auto_20200313_2300'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='coefficientname',
            constraint=models.UniqueConstraint(fields=('calibration_name',), name='unique_name'),
        ),
    ]
