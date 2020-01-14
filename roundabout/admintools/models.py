from django.db import models
from django.contrib.postgres.fields import JSONField

from roundabout.assemblies.models import AssemblyType
from roundabout.parts.models import Part

# AdminTool models

class Printer(models.Model):
    PRINTER_TYPES = (
        ('Brady', 'Brady'),
        ('Zebra', 'Zebra'),
    )
    name = models.CharField(max_length=255, unique=False, db_index=True)
    ip_domain = models.CharField(max_length=255, unique=True)
    printer_type = models.CharField(max_length=20, choices=PRINTER_TYPES, default='Brady')

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class TempImport(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    column_headers = JSONField()

    def __str__(self):
        return self.name


class TempImportItem(models.Model):
    data = JSONField()
    tempimport = models.ForeignKey(TempImport, related_name='tempimportitems',
                                   on_delete=models.CASCADE, null=True, blank=False)

    def __str__(self):
        return str(self.id)


# Assembly base model
class TempImportAssembly(models.Model):
    name = models.CharField(max_length=255, unique=False, db_index=True)
    assembly_type = models.ForeignKey(AssemblyType, related_name='assemblies',
                                    on_delete=models.SET_NULL, null=True, blank=True)
    assembly_number = models.CharField(max_length=100, unique=False, db_index=True, null=False, blank=True)
    description = models.TextField(blank=True)
