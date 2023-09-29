# Generated by Django 3.1.3 on 2021-09-08 18:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('parts', '0019_remove_part_revision'),
        ('inventory', '0070_merge_20210611_1633'),
        ('assemblies', '0015_auto_20210611_1748'),
        ('ooi_ci_tools', '0016_auto_20210902_1826'),
    ]

    operations = [
        migrations.CreateModel(
            name='BulkUploadEvent',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('approved', models.BooleanField(choices=[(True, 'Approved'), (False, 'Draft')], default=False)),
                ('detail', models.TextField(blank=True)),
                ('assembly_part', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assemblypart_bulkuploadevents', to='assemblies.assemblypart')),
                ('deployment', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='deployment_bulkuploadevents', to='inventory.deployment')),
                ('inventory', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='inventory_bulkuploadevents', to='inventory.inventory')),
                ('part', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='part_bulkuploadevents', to='parts.part')),
                ('user_approver', models.ManyToManyField(related_name='approver_bulkuploadevents', to=settings.AUTH_USER_MODEL)),
                ('user_draft', models.ManyToManyField(blank=True, related_name='reviewer_bulkuploadevents', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='BulkVocabRecord',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('equip_desc', models.CharField(blank=True, max_length=255)),
                ('manufacturer', models.CharField(blank=True, max_length=255)),
                ('asset_model', models.CharField(blank=True, max_length=255)),
                ('bulk_upload_event', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='vocab_records', to='ooi_ci_tools.bulkuploadevent')),
            ],
        ),
        migrations.CreateModel(
            name='BulkAssetRecord',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('asset_uid', models.CharField(blank=True, max_length=255)),
                ('legacy_asset_uid', models.CharField(blank=True, max_length=255)),
                ('asset_type', models.CharField(blank=True, max_length=255)),
                ('mobile', models.CharField(blank=True, max_length=255)),
                ('equip_desc', models.CharField(blank=True, max_length=255)),
                ('mio_inv_desc', models.CharField(blank=True, max_length=255)),
                ('manufacturer', models.CharField(blank=True, max_length=255)),
                ('asset_model', models.CharField(blank=True, max_length=255)),
                ('manufacturer_serial_number', models.CharField(blank=True, max_length=255)),
                ('firmware_version', models.CharField(blank=True, max_length=255)),
                ('acquisition_date', models.CharField(blank=True, max_length=255)),
                ('original_cost', models.CharField(blank=True, max_length=255)),
                ('comments', models.CharField(blank=True, max_length=255)),
                ('mio', models.CharField(blank=True, max_length=255)),
                ('bulk_upload_event', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='asset_records', to='ooi_ci_tools.bulkuploadevent')),
            ],
        ),
    ]