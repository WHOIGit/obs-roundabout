# Generated by Django 3.1.3 on 2021-01-07 19:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cruises', '0017_auto_20210107_1842'),
    ]

    operations = [
        migrations.CreateModel(
            name='CruiseHyperlink',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=255)),
                ('url', models.CharField(max_length=1000)),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='hyperlinks', to='cruises.cruise')),
            ],
            options={
                'ordering': ['text'],
            },
        ),
    ]
