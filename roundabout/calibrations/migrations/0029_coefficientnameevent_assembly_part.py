# Generated by Django 3.1.3 on 2021-04-26 15:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assemblies', '0011_auto_20201117_2030'),
        ('calibrations', '0028_auto_20210426_1528'),
    ]

    operations = [
        migrations.AddField(
            model_name='coefficientnameevent',
            name='assembly_part',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assemblypart_coefficientnameevents', to='assemblies.assemblypart'),
        ),
    ]