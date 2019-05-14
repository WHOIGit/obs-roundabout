# Generated by Django 2.0.12 on 2019-05-14 14:49

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Field',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('field_name', models.CharField(db_index=True, max_length=255, unique=True)),
                ('field_description', models.CharField(blank=True, max_length=255)),
                ('field_type', models.CharField(choices=[('CharField', 'Text Field'), ('IntegerField', 'Integer Field'), ('DecimalField', 'Decimal Field'), ('DateField', 'Date Field'), ('BooleanField', 'Boolean Field')], max_length=100)),
                ('field_default_value', models.CharField(blank=True, max_length=255)),
                ('field_all_part_types', models.BooleanField(default=False)),
                ('field_value_is_global', models.BooleanField(default=False)),
            ],
            options={
                'ordering': ('field_name',),
            },
        ),
    ]
