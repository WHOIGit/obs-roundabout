# Generated by Django 3.1.3 on 2021-06-09 06:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calibrations', '0029_coefficientnameevent_assembly_part'),
    ]

    operations = [
        migrations.AlterField(
            model_name='calibrationeventhyperlink',
            name='url',
            field=models.URLField(max_length=1000),
        ),
    ]