# Generated by Django 2.2.10 on 2020-04-21 18:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cruises', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='vessel',
            name='prefix',
            field=models.CharField(blank=True, max_length=10),
        ),
        migrations.AddField(
            model_name='vessel',
            name='vessel_designation',
            field=models.CharField(default='R/V', max_length=10),
        ),
    ]