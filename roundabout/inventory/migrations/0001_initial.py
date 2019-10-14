# Generated by Django 2.2.4 on 2019-10-14 14:48

import datetime
from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import mptt.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('assemblies', '0001_initial'),
        ('locations', '0001_initial'),
        ('builds', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Action',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action_type', models.CharField(choices=[('invadd', 'Add Inventory'), ('invchange', 'Inventory Change'), ('locationchange', 'Location Change'), ('subchange', 'Subassembly Change'), ('addtobuild', 'Add to Build'), ('removefrombuild', 'Remove from Build'), ('deploymentburnin', 'Deployment Burnin'), ('deploymenttosea', 'Deployment to Sea'), ('deploymentupdate', 'Deployment Update'), ('deploymentrecover', 'Deployment Recovered'), ('assigndest', 'Assign Destination'), ('removedest', 'Remove Destination'), ('test', 'Test'), ('note', 'Note'), ('historynote', 'Historical Note'), ('ticket', 'Work Ticket'), ('fieldchange', 'Field Change'), ('flag', 'Flag'), ('movetotrash', 'Move to Trash')], max_length=20)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('detail', models.TextField(blank=True)),
            ],
            options={
                'ordering': ['-created_at', 'action_type'],
            },
        ),
        migrations.CreateModel(
            name='Deployment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('deployment_number', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['build', '-created_at'],
            },
        ),
        migrations.CreateModel(
            name='DeploymentAction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action_type', models.CharField(choices=[('deploy', 'Deployed to Sea'), ('recover', 'Recovered from Sea'), ('retire', 'Retired'), ('create', 'Created'), ('burnin', 'Burn In'), ('details', 'Deployment Details')], max_length=20)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('detail', models.TextField(blank=True)),
                ('latitude', models.DecimalField(blank=True, decimal_places=7, max_digits=10, null=True, validators=[django.core.validators.MaxValueValidator(90), django.core.validators.MinValueValidator(0)])),
                ('longitude', models.DecimalField(blank=True, decimal_places=7, max_digits=10, null=True, validators=[django.core.validators.MaxValueValidator(180), django.core.validators.MinValueValidator(0)])),
                ('depth', models.PositiveIntegerField(blank=True, null=True)),
            ],
            options={
                'ordering': ['-created_at', 'action_type'],
            },
        ),
        migrations.CreateModel(
            name='DeploymentSnapshot',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('notes', models.TextField(blank=True)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Inventory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('serial_number', models.CharField(db_index=True, max_length=255, unique=True)),
                ('old_serial_number', models.CharField(blank=True, max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('detail', models.TextField(blank=True)),
                ('test_result', models.NullBooleanField(choices=[(None, '-'), (True, 'Pass'), (False, 'Fail')])),
                ('test_type', models.CharField(blank=True, choices=[('incoming', 'Incoming Test'), ('outgoing', 'Outgoing Test')], max_length=20, null=True)),
                ('flag', models.BooleanField(choices=[(True, 'Flagged'), (False, 'Unflagged')], default=False)),
                ('time_at_sea', models.DurationField(blank=True, default=datetime.timedelta(0), null=True)),
                ('lft', models.PositiveIntegerField(db_index=True, editable=False)),
                ('rght', models.PositiveIntegerField(db_index=True, editable=False)),
                ('tree_id', models.PositiveIntegerField(db_index=True, editable=False)),
                ('level', models.PositiveIntegerField(db_index=True, editable=False)),
                ('assembly_part', mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='inventory', to='assemblies.AssemblyPart')),
                ('assigned_destination_root', mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='assigned_children', to='inventory.Inventory')),
                ('build', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='inventory', to='builds.Build')),
                ('deployment', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='inventory', to='inventory.Deployment')),
                ('location', mptt.fields.TreeForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='inventory', to='locations.Location')),
                ('parent', mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='children', to='inventory.Inventory')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PhotoNote',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo', models.FileField(upload_to='notes/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx', 'xls', 'xlsx', 'png', 'jpg', 'jpeg', 'gif', 'csv'])])),
                ('action', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='photos', to='inventory.Action')),
                ('inventory', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='photos', to='inventory.Inventory')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='photos', to=settings.AUTH_USER_MODEL)),
            ],
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
                ('deployment', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='inventory_snapshot', to='inventory.DeploymentSnapshot')),
                ('inventory', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='inventory_snapshot', to='inventory.Inventory')),
                ('location', mptt.fields.TreeForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='inventory_snapshot', to='locations.Location')),
                ('parent', mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='children', to='inventory.InventorySnapshot')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
