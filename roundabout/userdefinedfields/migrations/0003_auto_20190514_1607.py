# Generated by Django 2.0.12 on 2019-05-14 16:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('userdefinedfields', '0002_auto_20190514_1602'),
    ]

    operations = [
        migrations.RenameField(
            model_name='field',
            old_name='part_types',
            new_name='global_for_part_types',
        ),
    ]