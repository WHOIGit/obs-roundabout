# Generated by Django 3.1.3 on 2021-06-11 17:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ooi_ci_tools', '0009_auto_20210603_1622'),
        ('assemblies', '0014_merge_20210611_1633'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assemblypart',
            name='reference_designator',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='assembly_parts', to='ooi_ci_tools.referencedesignator'),
        ),
    ]