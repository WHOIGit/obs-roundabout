# Generated by Django 2.2.1 on 2019-07-17 15:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('builds', '0010_auto_20190717_1454'),
    ]

    operations = [
        migrations.AddField(
            model_name='buildsnapshot',
            name='deployment_status',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]