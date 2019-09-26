# Generated by Django 2.2.1 on 2019-07-17 14:31

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import mptt.fields


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0073_auto_20190715_1525'),
        ('locations', '0011_location_root_type'),
        ('builds', '0008_build_flag'),
    ]

    operations = [
        migrations.CreateModel(
            name='BuildSnapshot',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('notes', models.TextField(blank=True)),
                ('build', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='build_snapshots', to='builds.Build')),
                ('deployment', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='build_snapshots', to='inventory.Deployment')),
                ('location', mptt.fields.TreeForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='build_snapshots', to='locations.Location')),
            ],
            options={
                'ordering': ['build', 'deployment', '-created_at'],
            },
        ),
        migrations.CreateModel(
            name='InventorySnapshot',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('order', models.CharField(blank=True, db_index=True, max_length=255)),
                ('lft', models.PositiveIntegerField(db_index=True, editable=False)),
                ('rght', models.PositiveIntegerField(db_index=True, editable=False)),
                ('tree_id', models.PositiveIntegerField(db_index=True, editable=False)),
                ('level', models.PositiveIntegerField(db_index=True, editable=False)),
                ('build', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='inventory_snapshots', to='builds.BuildSnapshot')),
                ('inventory', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='inventory_snapshots', to='inventory.Inventory')),
                ('location', mptt.fields.TreeForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='inventory_snapshots', to='locations.Location')),
                ('parent', mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='children', to='builds.InventorySnapshot')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]