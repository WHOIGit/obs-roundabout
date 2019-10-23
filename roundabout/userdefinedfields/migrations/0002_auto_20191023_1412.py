# Generated by Django 2.2.4 on 2019-10-23 14:12
"""
Auto generate necessary Groups and Permissions for User Defined Fields
Admin - all Permissions
Technician - all permissions
Inventory Only - only allowed to add/edit Field Values, no Field access
"""

from django.db import migrations
from django.apps import apps
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.management import create_permissions

Group = apps.get_model('auth','Group')
Permission = apps.get_model('auth','Permission')

def add_group_permissions(apps, schema_editor):
    # create Admin group, add all permissions
    group, created = Group.objects.get_or_create(name='admin')
    if created or group:
        # get all models for this app
        content_type = ContentType.objects.filter(app_label='userdefinedfields')
        # loop through each model for the app, get the permissions
        for c in content_type:
            permissions = Permission.objects.filter(content_type=c)
            # add permission to group
            for p in permissions:
                group.permissions.add(p)
                group.save()

    # create Technician group, add all permissions
    group, created = Group.objects.get_or_create(name='technician')
    if created or group:
        # get all models for this app
        content_type = ContentType.objects.filter(app_label='userdefinedfields')
        # loop through each model for the app, get the permissions
        for c in content_type:
            permissions = Permission.objects.filter(content_type=c)
            # add permission to group
            for p in permissions:
                group.permissions.add(p)
                group.save()

    # create Inventory Only group, add limited permissions
    group, created = Group.objects.get_or_create(name='inventory only')
    if created or group:
        # get FieldValue model for this app
        content_type = ContentType.objects.get(
            app_label='userdefinedfields',
            model='fieldvalue',
        )
        # get permissions for only this model
        permissions = Permission.objects.filter(content_type=content_type)
        # add permission to group
        for p in permissions:
            group.permissions.add(p)
            group.save()


class Migration(migrations.Migration):

    dependencies = [
        ('userdefinedfields', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_group_permissions),
    ]
