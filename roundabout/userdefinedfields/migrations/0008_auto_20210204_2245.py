# Generated by Django 3.1.3 on 2021-02-04 22:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userdefinedfields', '0007_fieldvalue_updated_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='field',
            name='choice_field_options',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
