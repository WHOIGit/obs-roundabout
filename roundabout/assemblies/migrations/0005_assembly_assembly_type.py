# Generated by Django 2.2.1 on 2019-06-19 15:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assemblies', '0004_assemblytype'),
    ]

    operations = [
        migrations.AddField(
            model_name='assembly',
            name='assembly_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='assemblies', to='assemblies.AssemblyType'),
        ),
    ]