# Generated by Django 2.2.13 on 2020-08-01 18:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0047_auto_20200723_1620_squashed_0048_auto_20200727_1905'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inventory',
            name='test_result',
            field=models.BooleanField(choices=[(None, '-'), (True, 'Pass'), (False, 'Fail')], null=True),
        ),
    ]