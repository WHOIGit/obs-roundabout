# Generated by Django 2.2.13 on 2020-07-13 15:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('configs_constants', '0009_auto_20200713_1519'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='constdefault',
            unique_together={('const_event', 'config_name')},
        ),
        migrations.RemoveField(
            model_name='constdefault',
            name='part',
        ),
    ]
