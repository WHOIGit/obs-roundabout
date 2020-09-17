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

from django import forms
from django.forms.models import inlineformset_factory
from django.utils import timezone
from bootstrap_datepicker_plus import DatePickerInput, DateTimePickerInput
from django.contrib.sites.models import Site
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Fieldset, ButtonHolder, Submit, Div, Field
from django_summernote.widgets import SummernoteInplaceWidget, SummernoteWidget

from .models import Build, BuildAction, BuildSnapshot, PhotoNote
from roundabout.inventory.models import Deployment, DeploymentAction, Action
from roundabout.locations.models import Location
# Get the app label names from the core utility functions
from roundabout.core.utils import set_app_labels
labels = set_app_labels()

class BuildForm(forms.ModelForm):
    build_number = forms.CharField(strip=True,
        help_text='%s Number auto-generated. Click here to override.' % (labels['label_builds_app_singular']),
        widget=forms.TextInput(attrs={'readonly':'readonly'}),
        label='%s Number' % (labels['label_builds_app_singular']),
    )

    class Meta:
        model = Build
        fields = ['assembly', 'assembly_revision', 'build_number', 'location', 'build_notes', ]
        labels = {
            'assembly': labels['label_assemblies_app_singular'],
            'assembly_revision': '%s Revision' % labels['label_assemblies_app_singular'],
            'build_notes': '%s Notes' % (labels['label_builds_app_singular']),
        }

    class Media:
        js = ('js/form-builds.js',)

    def __init__(self, *args, **kwargs):
        super(BuildForm, self).__init__(*args, **kwargs)
        if self.instance.pk:
            del self.fields['assembly']
            del self.fields['assembly_revision']


class BuildActionLocationChangeForm(forms.ModelForm):

    class Meta:
        model = Build
        fields = ['location', 'detail']
        labels = {
            'detail': 'Add a Note',
        }

    def __init__(self, *args, **kwargs):
        super(BuildActionLocationChangeForm, self).__init__(*args, **kwargs)
        self.initial['detail'] = ''


class BuildActionFlagForm(forms.ModelForm):

    class Meta:
        model = Build
        fields = ['flag', 'detail']
        labels = {
            'flag': 'Flag Part',
            'detail': 'Details',
        }

    def __init__(self, *args, **kwargs):
        super(BuildActionFlagForm, self).__init__(*args, **kwargs)
        self.initial['detail'] = ''


class BuildActionTestForm(forms.ModelForm):

    class Meta:
        model = Build
        fields = ['detail']
        labels = {
            'detail': 'Note on Test Results',
        }

    def __init__(self, *args, **kwargs):
        super(BuildActionTestForm, self).__init__(*args, **kwargs)
        self.initial['detail'] = ''


class BuildActionPhotoNoteForm(forms.ModelForm):
    photo_ids = forms.CharField(required=False, widget=forms.HiddenInput())

    class Meta:
        model = Action
        fields = ['detail', 'build', 'location', 'object_type']
        labels = {
            'detail': 'Add a Note',
        }
        widgets = {
            'build': forms.HiddenInput(),
            'location': forms.HiddenInput(),
            'object_type': forms.HiddenInput(),
            'detail': SummernoteWidget(),
        }

    def __init__(self, *args, **kwargs):
        super(BuildActionPhotoNoteForm, self).__init__(*args, **kwargs)
        self.initial['object_type'] = Action.BUILD


class BuildActionPhotoUploadForm(forms.ModelForm):

    class Meta:
        model = PhotoNote
        fields = ['photo', 'build']
        labels = {
            'detail': 'Add a Note',
        }
        widgets = {
            'build': forms.HiddenInput(),
            'detail': SummernoteWidget(),
        }


class BuildActionRetireForm(forms.ModelForm):

    class Meta:
        model = Build
        fields = ['location', 'detail', ]
        widgets = {
            'location': forms.HiddenInput(),
        }
        labels = {
            'detail': 'Reasons for retiring this Build',
        }

    def __init__(self, *args, **kwargs):
        super(BuildActionRetireForm, self).__init__(*args, **kwargs)
        self.initial['location'] = Location.objects.get(root_type='Retired')
        self.initial['detail'] = ''


class BuildSnapshotForm(forms.ModelForm):

    class Meta:
        model = BuildSnapshot
        fields = ['notes']
        labels = {
            'detail': 'Notes on Snapshot',
        }

    def __init__(self, *args, **kwargs):
        self.pk = kwargs.pop('pk')
        super(BuildSnapshotForm, self).__init__(*args, **kwargs)
        #self.fields['location'].queryset = Location.objects.exclude(id=self.pk)


class DeploymentForm(forms.ModelForm):

    class Meta:
        model = Deployment
        fields = ['location', 'deployment_number', 'build', 'deployed_location', 'cruise_deployed']

        labels = {
            'location': 'Current Location',
            'deployment_number': '%s Number' % (labels['label_deployments_app_singular']),
            'deployed_location': 'Final %s Location' % (labels['label_deployments_app_singular']),
            'cruise_deployed': 'Cruise Deployed On',
        }

        widgets = {
            'build': forms.HiddenInput(),
        }

    # Add custom date field to allow user to pick date for the Action
    date = forms.DateTimeField( widget=DateTimePickerInput(
            options={
                #"format": "MM/DD/YYYY, HH:mm", # moment date-time format
                "showClose": True,
                "showClear": True,
                "showTodayButton": False,
            }
        ),
        initial=timezone.now,
        help_text='Set all date/times to UTC time zone.',
    )


class DeploymentActionBurninForm(forms.ModelForm):

    class Meta:
        model = Deployment
        fields = ['location', 'deployed_location', 'cruise_deployed']
        labels = {
            'location': 'Select Location for Burn In',
            'deployed_location': 'Final %s Location' % (labels['label_deployments_app_singular']),
            'cruise_deployed': 'Cruise Deployed On',
        }

    # Add custom date field to allow user to pick date for the Action
    date = forms.DateTimeField( widget=DateTimePickerInput(
            options={
                #"format": "MM/DD/YYYY, HH:mm", # moment date-time format
                "showClose": True,
                "showClear": True,
                "showTodayButton": False,
            }
        ),
        initial=timezone.now,
        help_text='Set all date/times to UTC time zone.',
    )


class DeploymentActionDeployForm(forms.ModelForm):

    class Meta:
        model = Deployment
        fields = ['location', 'cruise_deployed']
        labels = {
            'location': '%s Location' % (labels['label_deployments_app_singular']),
            'cruise_deployed': 'Cruise Deployed On',
        }

    # Add custom date field to allow user to pick date for the Action record
    date = forms.DateTimeField( widget=DateTimePickerInput(
            options={
                #"format": "MM/DD/YYYY, HH:mm", # moment date-time format
                "showClose": True,
                "showClear": True,
                "showTodayButton": False,
                #"maxDate": timezone.now().strftime('%m/%d/%Y %H:%M'),
            }
        ),
        initial=timezone.now,
        help_text='Set all date/times to UTC time zone.',
    )
    # Add lat/long, depth fields for the Action record
    latitude = forms.DecimalField(required=False)
    longitude = forms.DecimalField(required=False)
    depth = forms.IntegerField(label='Depth in Meters', min_value=0, required=False)

    def __init__(self, *args, **kwargs):
        super(DeploymentActionDeployForm, self).__init__(*args, **kwargs)
        self.initial['location'] = self.instance.deployed_location

        self.helper = FormHelper()
        self.helper.layout = Layout(
            Div(
                Field('date'),
            ),
            Div(
                Field('latitude', wrapper_class='col-md-4'),
                Field('longitude', wrapper_class='col-md-4'),
                Field('depth', wrapper_class='col-md-4'),
                css_class='form-row'
            ),
            Div(
                Field('location'),
            )
        )


class DeploymentActionDetailsForm(forms.ModelForm):

    class Meta:
        model = Deployment
        fields = ['location', 'cruise_deployed']
        labels = {
            'location': '%s Location' % (labels['label_deployments_app_singular']),
            'cruise_deployed': 'Cruise Deployed On',
        }

    # Add custom date field to allow user to pick date for the Action record
    date = forms.DateTimeField( widget=DateTimePickerInput(
            options={
                #"format": "MM/DD/YYYY, HH:mm", # moment date-time format
                "showClose": True,
                "showClear": True,
                "showTodayButton": False,
            }
        ),
        initial=timezone.now,
        help_text='Set all date/times to UTC time zone.',
    )
    # Add lat/long, depth fields for the Action record
    latitude = forms.DecimalField(required=False)
    longitude = forms.DecimalField(required=False)
    depth = forms.IntegerField(label='Depth in Meters', min_value=0, required=False)

    def __init__(self, *args, **kwargs):
        super(DeploymentActionDetailsForm, self).__init__(*args, **kwargs)
        self.initial['location'] = self.instance.deployed_location

        self.helper = FormHelper()
        self.helper.layout = Layout(
            Div(
                Field('date'),
            ),
            Div(
                Field('latitude', wrapper_class='col-md-4'),
                Field('longitude', wrapper_class='col-md-4'),
                Field('depth', wrapper_class='col-md-4'),
                css_class='form-row'
            ),
            Div(
                Field('location'),
            )
        )


class DeploymentActionRecoverForm(forms.ModelForm):

    class Meta:
        model = Deployment
        fields = ['location', 'cruise_recovered']
        labels = {
            'location': 'Select Location to recover %s to:' % (labels['label_deployments_app_singular']),
            'cruise_recovered': 'Cruise Recovered On'
        }

    # Add custom date field to allow user to pick date for the Action record
    date = forms.DateTimeField( widget=DateTimePickerInput(
            options={
                #"format": "MM/DD/YYYY, HH:mm", # moment date-time format
                "showClose": True,
                "showClear": True,
                "showTodayButton": False,
            }
        ),
        initial=timezone.now,
        help_text='Set all date/times to UTC time zone.',
    )

    def __init__(self, *args, **kwargs):
        super(DeploymentActionRecoverForm, self).__init__(*args, **kwargs)
        self.fields['location'].required = True


class DeploymentActionRetireForm(forms.ModelForm):

    class Meta:
        model = Deployment
        fields = ['location',]
        widgets = {
            'location': forms.HiddenInput()
        }

    # Add custom date field to allow user to pick date for the Action
    date = forms.DateTimeField( widget=DateTimePickerInput(
            options={
                #"format": "MM/DD/YYYY, HH:mm", # moment date-time format
                "showClose": True,
                "showClear": True,
                "showTodayButton": False,
            }
        ),
        initial=timezone.now,
        help_text='Set all date/times to UTC time zone.',
    )
