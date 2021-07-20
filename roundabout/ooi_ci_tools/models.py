"""
# Copyright (C) 2019-2020 Woods Hole Oceanographic Institution
#
# This file is part of the Roundabout Database project ("RDB" or
# "ooicgsn-roundabout").
#
# ooicgsn-roundabout is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 2 of the License, or
# (at your option) any later version.
#
# ooicgsn-roundabout is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with ooicgsn-roundabout in the COPYING.md file at the project root.
# If not, see <http://www.gnu.org/licenses/>.
"""


from django.db import models
from mptt.models import MPTTModel, TreeForeignKey
from roundabout.inventory.models import Action
from roundabout.users.models import User
from roundabout.parts.models import Part
from roundabout.assemblies.models import AssemblyPart
from roundabout.inventory.models import Inventory, Deployment

# Numerical Coefficient threshold by Calibration 
class Threshold(models.Model):
    class Meta:
        ordering = ['created_at']
    def __str__(self):
        return self.detail
    def get_object_type(self):
        return 'comment'
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    low = models.CharField(max_length = 255, unique = False, db_index = False)
    high = models.CharField(max_length = 255, unique = False, db_index = False)
    coefficient_name = models.ForeignKey('calibrations.CoefficientName', related_name='thresholds', on_delete=models.CASCADE, null=True)
    config_name = models.ForeignKey('configs_constants.ConfigName', related_name='thresholds', on_delete=models.CASCADE, null=True)

# Comment model
class Comment(models.Model):
    class Meta:
        ordering = ['created_at']
    def __str__(self):
        return self.detail
    def get_object_type(self):
        return 'comment'
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    parent = models.ForeignKey('self', related_name = 'comments', on_delete=models.CASCADE, null=True)
    action = models.ForeignKey(Action, related_name='comments', on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(User, related_name='comments', on_delete=models.SET_NULL, null=True)
    detail = models.TextField(blank=True)

# MPTT Comment model
class MPTTComment(MPTTModel):
    class MPTTMeta:
        order_insertion_by = ["updated_at"]
    def __str__(self):
        return self.detail
    def get_object_type(self):
        return 'mptt_comment'
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    parent = TreeForeignKey("self",related_name="children",on_delete=models.SET_NULL,null=True,blank=True,db_index=True)
    action = models.ForeignKey(Action, related_name='mptt_comments', on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(User, related_name='mptt_comments', on_delete=models.SET_NULL, null=True)
    detail = models.TextField(blank=True)


# CSV Import configuration model
class ImportConfig(models.Model):
    def __str__(self):
        return self.created_at.strftime("%m/%d/%Y")
    def get_object_type(self):
        return 'import_configuration'
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    require_calibration_coefficient_values = models.BooleanField(blank=False, default=True)
    require_calibration_notes = models.BooleanField(blank=False, default=False)
    require_calibration_coefficient_threshold = models.BooleanField(blank=False, default=False)
    require_deployment_sensor_uid = models.BooleanField(blank=False, default=True)
    require_deployment_startDateTime = models.BooleanField(blank=False, default=True)
    require_deployment_stopDateTime = models.BooleanField(blank=False, default=True)
    require_deployment_lat = models.BooleanField(blank=False, default=True)
    require_deployment_lon = models.BooleanField(blank=False, default=True)
    require_deployment_mooring_uid = models.BooleanField(blank=False, default=True)
    require_deployment_CUID_Deploy = models.BooleanField(blank=False, default=True)
    require_deployment_node_uid = models.BooleanField(blank=False, default=False)
    require_deployment_versionNumber = models.BooleanField(blank=False, default=True)
    require_deployment_deployedBy = models.BooleanField(blank=False, default=False)
    require_deployment_CUID_Recover = models.BooleanField(blank=False, default=True)
    require_deployment_orbit = models.BooleanField(blank=False, default=False)
    require_deployment_deployment_depth = models.BooleanField(blank=False, default=True)
    require_deployment_water_depth = models.BooleanField(blank=False, default=True)
    require_deployment_notes = models.BooleanField(blank=False, default=False)
    require_cruise_ship_name = models.BooleanField(blank=False, default=True)
    require_cruise_cruise_start_date = models.BooleanField(blank=False, default=True)
    require_cruise_cruise_end_date = models.BooleanField(blank=False, default=True)
    require_cruise_notes = models.BooleanField(blank=False, default=True)
    require_vessel_vesseldesignation = models.BooleanField(blank=False, default=True)
    require_vessel_designation = models.BooleanField(blank=False, default=True)
    require_vessel_vessel_name = models.BooleanField(blank=False, default=True)
    require_vessel_ICES_code = models.BooleanField(blank=False, default=True)
    require_vessel_operator = models.BooleanField(blank=False, default=True)
    require_vessel_call_sign = models.BooleanField(blank=False, default=True)
    require_vessel_MMSI_number = models.BooleanField(blank=False, default=True)
    require_vessel_IMO_number = models.BooleanField(blank=False, default=True)
    require_vessel_length = models.BooleanField(blank=False, default=True)
    require_vessel_max_speed = models.BooleanField(blank=False, default=True)
    require_vessel_max_draft = models.BooleanField(blank=False, default=True)
    require_vessel_active = models.BooleanField(blank=False, default=True)
    require_vessel_R2R = models.BooleanField(blank=False, default=True)


# Generic class to handle Calibration, Configuration, Constant, Comment, and Reference Designator Events
class CCCEvent(models.Model):
    class Meta:
        abstract = True
    def __str__(self):
        return self.detail
    def get_object_type(self):
        return 'ccc_event'
    APPROVAL_STATUS = (
        (True, "Approved"),
        (False, "Draft"),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user_draft = models.ManyToManyField(User, related_name='reviewer_%(class)ss', blank=True)
    user_approver = models.ManyToManyField(User, related_name='approver_%(class)ss')
    approved = models.BooleanField(choices=APPROVAL_STATUS, blank=False, default=False)
    detail = models.TextField(blank=True)
    part = models.ForeignKey(Part, related_name='part_%(class)ss', on_delete=models.CASCADE, null=True)
    assembly_part = models.ForeignKey(AssemblyPart, related_name='assemblypart_%(class)ss', on_delete=models.CASCADE, null=True)
    inventory = models.ForeignKey(Inventory, related_name='inventory_%(class)ss', on_delete=models.CASCADE, null=True)
    deployment = models.ForeignKey(Deployment, related_name='deployment_%(class)ss', on_delete=models.CASCADE, null=True)

    def get_sorted_reviewers(self):
        return self.user_draft.all().order_by('username')

    def get_sorted_approvers(self):
        return self.user_approver.all().order_by('username')


# Handles Reference Designator-related Events
class ReferenceDesignatorEvent(CCCEvent):
    class Meta:
        ordering = ['-created_at']
    def __str__(self):
        return self.name
    def get_object_type(self):
        return 'reference_designator_event'

    def get_actions(self):
        return self.actions.filter(object_type='referencedesignatorevent')


# Handles raw values set within the Event
class ReferenceDesignator(models.Model):
    class Meta:
        ordering = ['refdes_name']
    def __str__(self):
        return self.refdes_name
    def get_object_type(self):
        return 'reference_designator'
    refdes_name = models.CharField(max_length=255, unique=False, db_index=True)
    refdes_event = models.ForeignKey(ReferenceDesignatorEvent, related_name='reference_designators', on_delete=models.CASCADE, null=True)