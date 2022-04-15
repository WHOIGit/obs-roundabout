# Generated by Django 3.1.3 on 2021-09-13 16:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ooi_ci_tools', '0017_bulkassetrecord_bulkuploadevent_bulkvocabrecord'),
    ]

    operations = [
        migrations.AddField(
            model_name='bulkassetrecord',
            name='array_geometry',
            field=models.CharField(blank=True, max_length=1000),
        ),
        migrations.AddField(
            model_name='bulkassetrecord',
            name='commission_date',
            field=models.CharField(blank=True, max_length=1000),
        ),
        migrations.AddField(
            model_name='bulkassetrecord',
            name='decommission_date',
            field=models.CharField(blank=True, max_length=1000),
        ),
    ]