# Generated by Django 2.2.13 on 2020-09-01 17:11

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calibrations', '0019_auto_20200901_1704'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coefficientnameevent',
            name='user_draft',
            field=models.ManyToManyField(blank=True, related_name='coefficient_name_events_reviewers', to=settings.AUTH_USER_MODEL),
        ),
    ]