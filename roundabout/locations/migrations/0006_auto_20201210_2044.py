# Generated by Django 3.1.3 on 2020-12-10 20:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('locations', '0005_auto_20201014_1253'),
    ]

    operations = [
        migrations.RenameField(
            model_name='location',
            old_name='location_id',
            new_name='location_code',
        ),
    ]