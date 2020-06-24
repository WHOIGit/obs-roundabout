# Generated by Django 2.2.13 on 2020-06-11 17:42

from django.apps import apps
from django.db import migrations

BuildAction = apps.get_model('builds', 'BuildAction')
Action = apps.get_model('inventory', 'Action')

# ------------------------------------------------------------------------------
# Step 1 in migration
def update_builds_actions(apps, schema_editor):
    actions = BuildAction.objects.all()

    for action in actions:
        if action.action_type == 'subassemblychange':
            action.action_type = 'subchange'
        elif action.action_type == 'buildadd':
            action.action_type = 'add'
        elif action.action_type == 'deploymenttosea':
            action.action_type = 'deploymenttofield'
        action.save()


# Step 2 in migration, copy to Action table
def import_old_actions(apps, schema_editor):
    actions = BuildAction.objects.all()
    for action in actions:
        new_action = Action.objects.create(
            build=action.build,
            action_type=action.action_type,
            object_type='build',
            location=action.location,
            created_at=action.created_at,
            detail=action.detail,
            user=action.user,
        )


class Migration(migrations.Migration):

    dependencies = [
        ('builds', '0016_auto_20200531_1905'),
        ('inventory', '0019_auto_20200522_1822.py'),
    ]

    operations = [
        migrations.RunPython(update_builds_actions),
        migrations.RunPython(import_old_actions),
    ]
