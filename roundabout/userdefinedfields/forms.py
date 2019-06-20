from django import forms

from .models import Field


class UserDefinedFieldForm(forms.ModelForm):

    class Meta:
        model = Field
        fields = ['field_name', 'field_description', 'field_type', 'field_default_value',
                  'global_for_part_types' ]
        labels = {
            'global_for_part_types': 'Global field for all Parts of this Type',
        }

        widgets = {
            'global_for_part_types': forms.CheckboxSelectMultiple()
        }