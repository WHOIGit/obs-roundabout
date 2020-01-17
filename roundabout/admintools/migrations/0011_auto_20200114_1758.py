# Generated by Django 2.2.9 on 2020-01-14 17:58

from django.db import migrations, models
import django.db.models.deletion
import mptt.fields


class Migration(migrations.Migration):

    dependencies = [
        ('admintools', '0010_auto_20200114_1712'),
    ]

    operations = [
        migrations.AddField(
            model_name='tempimportassemblypart',
            name='level',
            field=models.PositiveIntegerField(db_index=True, default=1, editable=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='tempimportassemblypart',
            name='lft',
            field=models.PositiveIntegerField(db_index=True, default=1, editable=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='tempimportassemblypart',
            name='previous_parent',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='tempimportassemblypart',
            name='rght',
            field=models.PositiveIntegerField(db_index=True, default=1, editable=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='tempimportassemblypart',
            name='tree_id',
            field=models.PositiveIntegerField(db_index=True, default=1, editable=False),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='tempimportassemblypart',
            name='parent',
            field=mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='admintools.TempImportAssemblyPart'),
        ),
    ]
