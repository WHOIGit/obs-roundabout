# Generated by Django 3.1.3 on 2021-04-22 14:36

from django.db import migrations
import django.db.models.deletion
import mptt.fields


class Migration(migrations.Migration):

    dependencies = [
        ('locations', '0007_remove_location_location_type'),
        ('inventory', '0063_action_data'),
    ]

    operations = [
        migrations.AddField(
            model_name='action',
            name='location_parent',
            field=mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='location_parent_actions', to='locations.location'),
        ),
    ]