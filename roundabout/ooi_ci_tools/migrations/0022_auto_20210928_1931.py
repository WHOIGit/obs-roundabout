# Generated by Django 3.1.3 on 2021-09-28 19:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ooi_ci_tools', '0021_auto_20210928_1900'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='referencedesignatorevent',
            name='deployment',
        ),
        migrations.RemoveField(
            model_name='referencedesignatorevent',
            name='inventory',
        ),
        migrations.RemoveField(
            model_name='referencedesignatorevent',
            name='part',
        ),
    ]