# Generated by Django 3.1.3 on 2021-06-09 06:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configs_constants', '0023_auto_20210426_1537'),
    ]

    operations = [
        migrations.AlterField(
            model_name='configeventhyperlink',
            name='url',
            field=models.URLField(max_length=1000),
        ),
    ]