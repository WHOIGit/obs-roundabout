# Generated by Django 2.2.10 on 2020-05-13 15:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cruises', '0007_auto_20200428_1805'),
    ]

    operations = [
        migrations.AddField(
            model_name='cruise',
            name='friendly_name',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='vessel',
            name='notes',
            field=models.TextField(blank=True),
        ),
    ]