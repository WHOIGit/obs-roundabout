# Generated by Django 2.2.13 on 2020-06-10 17:35
from django.apps import apps
from django.db import migrations

Action = apps.get_model('inventory', 'Action')

def update_actions(apps, schema_editor):
    actions = Action.objects.all()

    for action in actions:
        if action.action_type == 'deploymenttosea':
            action.action_type = 'deploymenttofield'
        action.save()

class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0034_auto_20200610_1734'),
    ]

    operations = [
        migrations.RunPython(update_actions),
    ]