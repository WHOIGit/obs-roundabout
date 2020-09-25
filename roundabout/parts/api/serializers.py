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

from rest_framework import serializers
from rest_flex_fields import FlexFieldsModelSerializer
from ..models import Part, PartType, Revision, Documentation

API_VERSION = 'api_v1'
class PartTypeSerializer(FlexFieldsModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name = API_VERSION + ':part-templates/part-types-detail',
        lookup_field = 'pk',
    )
    parent = serializers.HyperlinkedRelatedField(
        view_name = 'api_v1:part-templates/part-types-detail',
        lookup_field = 'pk',
        queryset = PartType.objects
    )
    children = serializers.HyperlinkedRelatedField(
        view_name = 'api_v1:part-templates/part-types-detail',
        many = True,
        read_only = True,
        lookup_field = 'pk',
    )
    parts = serializers.HyperlinkedRelatedField(
        view_name = 'api_v1:part-templates/parts-detail',
        many = True,
        read_only = True,
        lookup_field = 'pk',
    )

    class Meta:
        model = PartType
        fields = ['id', 'url', 'name', 'parent', 'children', 'parts',]

        expandable_fields = {
            'parent': 'roundabout.parts.api.serializers.PartTypeSerializer',
            'children': ('roundabout.parts.api.serializers.PartTypeSerializer', {'many': True}),
            'parts': ('roundabout.parts.api.serializers.PartSerializer', {'many': True})
        }


class PartSerializer(FlexFieldsModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name = 'api_v1:part-templates/parts-detail',
        lookup_field = 'pk',
    )
    part_type = serializers.HyperlinkedRelatedField(
        view_name = 'api_v1:part-templates/part-types-detail',
        lookup_field = 'pk',
        queryset = PartType.objects
    )
    revisions= serializers.HyperlinkedRelatedField(
        view_name = 'api_v1:part-templates/revisions-detail',
        lookup_field = 'pk',
        many = True,
        read_only = True,
    )

    class Meta:
        model = Part
        fields = [
            'id',
            'url',
            'name',
            'revisions',
            'part_type',
            'friendly_name',
            'part_number',
            'unit_cost',
            'refurbishment_cost',
            'note',
            'user_defined_fields',
            'cal_dec_places',
        ]

        expandable_fields = {
            'part_type': 'roundabout.parts.api.serializers.PartTypeSerializer',
            'revisions': ('roundabout.parts.api.serializers.RevisionSerializer', {'many': True})
        }


class RevisionSerializer(FlexFieldsModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name = 'api_v1:part-templates/revisions-detail',
        lookup_field = 'pk',
    )
    part = serializers.HyperlinkedRelatedField(
        view_name = 'api_v1:part-templates/parts-detail',
        lookup_field = 'pk',
        queryset = PartType.objects
    )
    documentation= serializers.HyperlinkedRelatedField(
        view_name = 'api_v1:part-templates/documents-detail',
        lookup_field = 'pk',
        many = True,
        read_only = True,
    )

    class Meta:
        model = Revision
        fields = [
            'id',
            'url',
            'revision_code',
            'part',
            'unit_cost',
            'refurbishment_cost',
            'note',
            'created_at',
            'documentation',
        ]

        expandable_fields = {
            'part': 'roundabout.parts.api.serializers.PartSerializer',
            'documentation': ('roundabout.parts.api.serializers.DocumentationSerializer', {'many': True})
        }


class DocumentationSerializer(FlexFieldsModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name = 'api_v1:part-templates/documents-detail',
        lookup_field = 'pk',
    )
    revision = serializers.HyperlinkedRelatedField(
        view_name = 'api_v1:part-templates/revisions-detail',
        lookup_field = 'pk',
        queryset = Revision.objects
    )

    class Meta:
        model = Documentation
        fields = [
            'id', 'url', 'name', 'doc_type', 'doc_link', 'revision',
        ]

        expandable_fields = {
            'revision': 'roundabout.parts.api.serializers.RevisionSerializer',
        }
