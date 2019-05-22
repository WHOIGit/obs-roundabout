import re
import json

from django.shortcuts import render, get_object_or_404
from django.urls import reverse, reverse_lazy
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.views.generic import View, FormView, DetailView, ListView, RedirectView, UpdateView, CreateView, DeleteView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.core.exceptions import ValidationError
from django.template.defaultfilters import slugify

from .models import Part, PartType, Revision, Documentation
from .forms import PartForm, RevisionForm, DocumentationFormset, RevisionFormset, PartUdfAddFieldForm, PartUdfFieldSetValueForm

from roundabout.locations.models import Location
from roundabout.inventory.models import Inventory
from roundabout.userdefinedfields.models import Field, FieldValue

from common.util.mixins import AjaxFormMixin

# Mixins

# Create the queryset for the Parts navtree display
class PartsNavTreeMixin(LoginRequiredMixin, PermissionRequiredMixin, object):
    permission_required = 'parts.add_part'
    redirect_field_name = 'home'

    def get_context_data(self, **kwargs):
        context = super(PartsNavTreeMixin, self).get_context_data(**kwargs)
        context.update({
            'part_types': PartType.objects.prefetch_related('parts')
        })
        return context


# AJAX Views

# Function to validate Part Number from AJAX request
def validate_part_number(request):
    part_number = request.GET.get('part_number')
    form_action = request.GET.get('form_action')
    initial_part_number = request.GET.get('initial_part_number')
    part = Part.objects.filter(part_number=part_number).first()

    if part:
        if part.part_number == str(initial_part_number):
            is_error = False
            error_message = ''
        else:
            is_error = True
            error_message = 'Part Number already in use! Part Number must be unique'
    else:
        is_error = False
        error_message = ''

    """
    else:
        if not re.match(r'^[a-zA-Z0-9_]{4}-[a-zA-Z0-9_]{5}-[a-zA-Z0-9_]{5}$', part_number):
            is_error = True
            error_message = 'Part Number in wrong format. Must be ####-#####-#####'
        else:
            is_error = False
            error_message = ''
    """

    data = {
        'is_error': is_error,
        'error_message': error_message,
    }
    return JsonResponse(data)


# Part Template Views

def load_parts_navtree(request):
    part_types = PartType.objects.prefetch_related('parts')
    return render(request, 'parts/ajax_part_navtree.html', {'part_types': part_types})


class PartsAjaxDetailView(LoginRequiredMixin, PermissionRequiredMixin, DetailView):
    model = Part
    context_object_name = 'part_template'
    template_name='parts/ajax_part_detail.html'
    permission_required = 'parts.add_part'
    redirect_field_name = 'home'

    def get_context_data(self, **kwargs):
        context = super(PartsAjaxDetailView, self).get_context_data(**kwargs)
        revision_count = Revision.objects.filter(part=self.object).count()

        if revision_count > 1:
            multiple_revision = True
        else:
            multiple_revision = False

        # Get custom fields with most recent Values
        if self.object.fieldvalues.exists():
            custom_fields = self.object.fieldvalues.filter(is_current=True)
        else:
            custom_fields = None

        context.update({
            'multiple_revision': multiple_revision,
            'custom_fields': custom_fields,
        })
        return context


class PartsAjaxCreateView(LoginRequiredMixin, PermissionRequiredMixin, AjaxFormMixin, CreateView):
    model = Part
    form_class = PartForm
    context_object_name = 'part_template'
    template_name='parts/ajax_part_form.html'
    permission_required = 'parts.add_part'
    redirect_field_name = 'home'

    def get(self, request, *args, **kwargs):
        self.object = None
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        revision_form = RevisionFormset(instance=self.object)
        documentation_form = DocumentationFormset(instance=self.object)
        return self.render_to_response(self.get_context_data(form=form, revision_form=revision_form, documentation_form=documentation_form))

    def post(self, request, *args, **kwargs):
        self.object = None
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        revision_form = RevisionFormset(
            self.request.POST, instance=self.object)
        documentation_form = DocumentationFormset(
            self.request.POST, instance=self.object)

        if (form.is_valid() and revision_form.is_valid() and documentation_form.is_valid()):
            return self.form_valid(form, revision_form, documentation_form)
        return self.form_invalid(form, revision_form, documentation_form)

    def form_valid(self, form, revision_form, documentation_form):
        self.object = form.save()
        # Save the Revision inline model form
        revision_form.instance = self.object
        revision_instances = revision_form.save()
        # Get the Revision object by looping through instance list
        for instance in revision_instances:
            revision = instance

        # Save the Documentation inline model form
        documentation_form.instance = revision
        documentation_instances = documentation_form.save(commit=False)
        # Update Documentation objects to have Revision key
        #for instance in documentation_instances:
        #    instance.revision = revision
        documentation_form.save()

        # Check for any global Part Type custom fields for this Part
        custom_fields = self.object.part_type.custom_fields.all()

        if custom_fields:
            for field in custom_fields:
                self.object.user_defined_fields.add(field)

        response = HttpResponseRedirect(self.get_success_url())

        if self.request.is_ajax():
            print(form.cleaned_data)
            data = {
                'message': "Successfully submitted form data.",
                'object_id': self.object.id,
            }
            return JsonResponse(data)
        else:
            return response

    def form_invalid(self, form, documentation_form):
        form_errors = documentation_form.errors

        if self.request.is_ajax():
            data = form.errors
            return JsonResponse(data, status=400)
        else:
            return self.render_to_response(self.get_context_data(form=form, revision_form=revision_form, documentation_form=documentation_form, form_errors=form_errors))

    def get_success_url(self):
        return reverse('parts:ajax_parts_detail', args=(self.object.id, ))


class PartsAjaxUpdateView(LoginRequiredMixin, PermissionRequiredMixin, AjaxFormMixin, UpdateView):
    model = Part
    form_class = PartForm
    context_object_name = 'part_template'
    template_name='parts/ajax_part_form.html'
    permission_required = 'parts.add_part'
    redirect_field_name = 'home'

    def form_valid(self, form):
        self.object = form.save()
        response = HttpResponseRedirect(self.get_success_url())

        if self.request.is_ajax():
            print(form.cleaned_data)
            data = {
                'message': "Successfully submitted form data.",
                'object_id': self.object.id,
            }
            return JsonResponse(data)
        else:
            return response

    def form_invalid(self, form):
        if self.request.is_ajax():
            data = form.errors
            return JsonResponse(data, status=400)
        else:
            return self.render_to_response(self.get_context_data(form=form, form_errors=form_errors))

    def get_success_url(self):
        return reverse('parts:ajax_parts_detail', args=(self.object.id, ))


class PartsAjaxDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    model = Part
    context_object_name='part_template'
    template_name = 'parts/ajax_part_confirm_delete.html'
    permission_required = 'parts.add_part'
    redirect_field_name = 'home'

    def delete(self, request, *args, **kwargs):
        self.object = self.get_object()
        data = {
            'message': "Successfully submitted form data.",
            'parent_id': self.object.part_type_id,
        }
        self.object.delete()
        return JsonResponse(data)


class PartsAjaxCreateRevisionView(LoginRequiredMixin, PermissionRequiredMixin, AjaxFormMixin, CreateView):
    model = Revision
    form_class = RevisionForm
    context_object_name = 'revision'
    template_name='parts/ajax_part_revision_form.html'
    permission_required = 'parts.add_part'
    redirect_field_name = 'home'

    def get_context_data(self, **kwargs):
        context = super(PartsAjaxCreateRevisionView, self).get_context_data(**kwargs)
        part_pk = self.kwargs['part_pk']
        part = Part.objects.get(id=part_pk)
        current_revision = Revision.objects.filter(part=part).last()

        context.update({
            'part': part,
            'current_revision': current_revision,
        })
        return context

    def get(self, request, *args, **kwargs):
        self.object = None
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        documentation_form = DocumentationFormset(instance=self.object)
        return self.render_to_response(self.get_context_data(form=form, documentation_form=documentation_form))

    def post(self, request, *args, **kwargs):
        self.object = None
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        documentation_form = DocumentationFormset(
            self.request.POST, instance=self.object)

        if (form.is_valid() and documentation_form.is_valid()):
            return self.form_valid(form, documentation_form)
        return self.form_invalid(form, documentation_form)

    def get_initial(self):
        #Returns the initial data from current revision
        initial = super(PartsAjaxCreateRevisionView, self).get_initial()
        # get the current revision object, prepopolate fields
        part = Part.objects.get(id=self.kwargs['part_pk'])
        current_revision = Revision.objects.filter(part=part).last()
        initial['part'] = part
        initial['revision_code'] = None
        initial['unit_cost'] = current_revision.unit_cost
        initial['refurbishment_cost'] = current_revision.refurbishment_cost

        return initial

    def form_valid(self, form, documentation_form):
        self.object = form.save()
        documentation_form.instance = self.object
        documentation_form.save()
        response = HttpResponseRedirect(self.get_success_url())

        if self.request.is_ajax():
            print(form.cleaned_data)
            data = {
                'message': "Successfully submitted form data.",
                'object_id': self.object.part.id,
            }
            return JsonResponse(data)
        else:
            return response

    def form_invalid(self, form, documentation_form):
        form_errors = documentation_form.errors

        if self.request.is_ajax():
            data = form.errors
            return JsonResponse(data, status=400)
        else:
            return self.render_to_response(self.get_context_data(form=form, documentation_form=documentation_form, form_errors=form_errors))

    def get_success_url(self):
        return reverse('parts:ajax_parts_detail', args=(self.object.part.id, ))


class PartsAjaxUpdateRevisionView(LoginRequiredMixin, PermissionRequiredMixin, AjaxFormMixin, UpdateView):
    model = Revision
    form_class = RevisionForm
    context_object_name = 'revision'
    template_name='parts/ajax_part_revision_form.html'
    permission_required = 'parts.add_part'
    redirect_field_name = 'home'

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        documentation_form = DocumentationFormset(instance=self.object)
        return self.render_to_response(self.get_context_data(form=form, documentation_form=documentation_form))

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        documentation_form = DocumentationFormset(
            self.request.POST, instance=self.object)

        if (form.is_valid() and documentation_form.is_valid()):
            return self.form_valid(form, documentation_form)
        return self.form_invalid(form, documentation_form)

    def form_valid(self, form, documentation_form):
        part_form = form.save()
        self.object = part_form
        documentation_form.instance = self.object
        documentation_form.save()
        response = HttpResponseRedirect(self.get_success_url())

        if self.request.is_ajax():
            print(form.cleaned_data)
            data = {
                'message': "Successfully submitted form data.",
                'object_id': self.object.part.id,
            }
            return JsonResponse(data)
        else:
            return response

    def form_invalid(self, form, documentation_form):
        form_errors = documentation_form.errors

        if self.request.is_ajax():
            data = form.errors
            return JsonResponse(data, status=400)
        else:
            return self.render_to_response(self.get_context_data(form=form, documentation_form=documentation_form, form_errors=form_errors))

    def get_success_url(self):
        return reverse('parts:ajax_parts_detail', args=(self.object.part.id, ))


class PartsAjaxDeleteRevisionView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    model = Revision
    context_object_name='revision'
    template_name = 'parts/ajax_part_revision_confirm_delete.html'
    permission_required = 'parts.add_part'
    redirect_field_name = 'home'

    def delete(self, request, *args, **kwargs):
        self.object = self.get_object()
        data = {
            'message': "Successfully submitted form data.",
            'parent_id': self.object.part.id,
            'object_model': self.object._meta.model_name,
        }
        self.object.delete()
        return JsonResponse(data)


# VIEWS FOR CUSTOM UDF FIELDS

# UpdateView to add custom UDF field to Part
class PartsAjaxAddUdfFieldUpdateView(LoginRequiredMixin, PermissionRequiredMixin, AjaxFormMixin, UpdateView):
    model = Part
    form_class = PartUdfAddFieldForm
    context_object_name = 'part_template'
    template_name='parts/ajax_part_udf_field_form.html'
    permission_required = 'parts.add_part'
    redirect_field_name = 'home'

    def form_valid(self, form):
        self.object = form.save()

        # If custom field has a default value, add it to any existing Inventory items that has no existing value
        if self.object.user_defined_fields.exists():
            for item in self.object.inventory.all():
                for field in self.object.user_defined_fields.all():
                    try:
                        currentvalue = item.fieldvalues.filter(field=field).latest(field_name='created_at')
                    except FieldValue.DoesNotExist:
                        currentvalue = None

                    if not currentvalue:
                        if field.field_default_value:
                            # create new value object with default value
                            fieldvalue = FieldValue.objects.create(field=field, field_value=field.field_default_value,
                                                           inventory=item, is_current=True, is_default_value=True)



        response = HttpResponseRedirect(self.get_success_url())

        if self.request.is_ajax():
            print(form.cleaned_data)
            data = {
                'message': "Successfully submitted form data.",
                'object_id': self.object.id,
            }
            return JsonResponse(data)
        else:
            return response

    def form_invalid(self, form):
        if self.request.is_ajax():
            data = form.errors
            return JsonResponse(data, status=400)
        else:
            return self.render_to_response(self.get_context_data(form=form, form_errors=form_errors))

    def get_success_url(self):
        return reverse('parts:ajax_parts_detail', args=(self.object.id, ))


# FormView to set UDF field value for Part
class PartsAjaxSetUdfFieldValueFormView(LoginRequiredMixin, PermissionRequiredMixin, AjaxFormMixin, FormView):
    template_name = 'parts/ajax_part_udf_setvalue_form.html'
    form_class = PartUdfFieldSetValueForm
    permission_required = 'parts.add_part'
    redirect_field_name = 'home'

    def get_context_data(self, **kwargs):
        context = super(PartsAjaxSetUdfFieldValueFormView, self).get_context_data(**kwargs)

        context.update({
            'part_template': Part.objects.get(id=self.kwargs['pk']),
            'custom_field': Field.objects.get(id=self.kwargs['field_pk']),
        })
        return context

    def get_form_kwargs(self):
        kwargs = super(PartsAjaxSetUdfFieldValueFormView, self).get_form_kwargs()
        if 'pk' in self.kwargs:
            kwargs['pk'] = self.kwargs['pk']
        if 'field_pk' in self.kwargs:
            kwargs['field_pk'] = self.kwargs['field_pk']
        return kwargs

    def form_valid(self, form):
        field_value = form.cleaned_data['field_value']
        part_id = self.kwargs['pk']
        field_id = self.kwargs['field_pk']

        part = Part.objects.get(id=part_id)

        #Check if this Part object has value for this field
        try:
            currentvalue = part.fieldvalues.filter(field_id=field_id).latest(field_name='created_at')
        except FieldValue.DoesNotExist:
            currentvalue = None

        # If current value is different than new value, update is_current to False
        if currentvalue and currentvalue.field_value != str(field_value):
            currentvalue.is_current = False
            currentvalue.save()
            # create new value object
            partfieldvalue = FieldValue.objects.create(field_id=field_id, field_value=field_value,
                                                    part_id=part_id, is_current=True)
        elif not currentvalue:
            # create new value object
            partfieldvalue = FieldValue.objects.create(field_id=field_id, field_value=field_value,
                                                    part_id=part_id, is_current=True)

        # If custom field has a default part value, add it to any existing Inventory items that has no existing value,
        # or is a Default Value
        for item in part.inventory.all():
            try:
                itemvalue = item.fieldvalues.filter(field_id=field_id).latest(field_name='created_at')
            except FieldValue.DoesNotExist:
                itemvalue = None

            if itemvalue and itemvalue.is_default_value == True:
                itemvalue.is_current = False
                itemvalue.save()
                # create new value object with Part level default value
                fieldvalue = FieldValue.objects.create(field_id=field_id, field_value=field_value,
                                                   inventory=item, is_current=True)
            elif not itemvalue:
                # create new value object with Part level default value
                fieldvalue = FieldValue.objects.create(field_id=field_id, field_value=field_value,
                                                   inventory=item, is_current=True)

        if self.request.is_ajax():
            print(form.cleaned_data)
            data = {
                'message': "Successfully submitted form data.",
                'object_id': part_id,
            }
            return JsonResponse(data)

    def form_invalid(self, form):
        if self.request.is_ajax():
            data = form.errors
            return JsonResponse(data, status=400)
        else:
            return self.render_to_response(self.get_context_data(form=form, form_errors=form_errors))

    def get_success_url(self):
        return reverse('parts:ajax_parts_detail', args=(part_id, ))


# Template View to confirm removal of a UDF field from a Part
class PartsAjaxRemoveUdfFieldView(LoginRequiredMixin, PermissionRequiredMixin, TemplateView):
    template_name = 'parts/ajax_part_udf_field_remove.html'
    permission_required = 'parts.add_part'
    redirect_field_name = 'home'

    def get_context_data(self, **kwargs):
        context = super(PartsAjaxRemoveUdfFieldView, self).get_context_data(**kwargs)
        part_template = Part.objects.get(id=self.kwargs['pk'])
        field = Field.objects.get(id=self.kwargs['field_pk'])

        context.update({
            'part_template': part_template,
            'field': field,
        })
        return context


# RedirectView to remove a UDF field from a Part
class PartsAjaxRemoveActionUdfFieldView(RedirectView):
    permanent = False
    query_string = True

    def get_redirect_url(self, *args, **kwargs):
        part_template = Part.objects.get(id=self.kwargs['pk'])
        field = Field.objects.get(id=self.kwargs['field_pk'])
        # Remove the field from the Part ManyToManyField
        part_template.user_defined_fields.remove(field)

        # Delete all FieldValue instances for items of this Part
        items = part_template.inventory.filter(fieldvalues__field=field)
        for item in items:
            fieldvalues = item.fieldvalues.filter(field=field)
            if fieldvalues:
                fieldvalues.delete()

        # Delete all global FieldValue instances for this Part
        partfieldvalues = part_template.fieldvalues.filter(field=field)
        if partfieldvalues:
            partfieldvalues.delete()

        return reverse('parts:ajax_parts_detail', args=(part_template.id, ) )


# Base Views

class PartsDetailView(LoginRequiredMixin, DetailView):
    model = Part
    template_name = 'parts/part_detail.html'
    context_object_name = 'part_template'

    def get_context_data(self, **kwargs):
        context = super(PartsDetailView, self).get_context_data(**kwargs)
        context.update({
            'node_type': 'parts'
        })
        return context

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        context = self.get_context_data(object=self.object)
        return self.render_to_response(context)


class PartsHomeView(LoginRequiredMixin, TemplateView):
    template_name = 'parts/part_list.html'

    def get_context_data(self, **kwargs):
        context = super(PartsHomeView, self).get_context_data(**kwargs)
        context.update({
            'node_type': 'parts'
        })
        return context

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        context = self.get_context_data(object=self.object)
        return self.render_to_response(context)


class PartsCreateView(PartsNavTreeMixin, CreateView):
    model = Part
    form_class = PartForm
    context_object_name = 'part_template'

    def get(self, request, *args, **kwargs):
        self.object = None
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        documentation_form = DocumentationFormset(instance=self.object)
        return self.render_to_response(self.get_context_data(form=form, documentation_form=documentation_form))

    def post(self, request, *args, **kwargs):
        self.object = None
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        documentation_form = DocumentationFormset(
            self.request.POST, instance=self.object)

        if (form.is_valid() and documentation_form.is_valid()):
            return self.form_valid(form, documentation_form)
        return self.form_invalid(form, documentation_form)

    def form_valid(self, form, documentation_form):
        self.object = form.save()
        documentation_form.instance = self.object
        documentation_form.save()
        return HttpResponseRedirect(self.get_success_url())

    def form_invalid(self, form, documentation_form):
        form_errors = documentation_form.errors
        return self.render_to_response(self.get_context_data(form=form, documentation_form=documentation_form, form_errors=form_errors))

    def get_success_url(self):
        return reverse('parts:parts_detail', args=(self.object.id, ))


class PartsUpdateView(PartsNavTreeMixin, UpdateView):
    model = Part
    form_class = PartForm
    context_object_name = 'part_template'

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        documentation_form = DocumentationFormset(instance=self.object)
        return self.render_to_response(self.get_context_data(form=form, documentation_form=documentation_form))

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        documentation_form = DocumentationFormset(
            self.request.POST, instance=self.object)

        if (form.is_valid() and documentation_form.is_valid()):
            return self.form_valid(form, documentation_form)
        return self.form_invalid(form, documentation_form)

    def form_valid(self, form, documentation_form):
        part_form = form.save()
        self.object = part_form
        documentation_form.instance = self.object
        documentation_form.save()
        return HttpResponseRedirect(self.get_success_url())

    def form_invalid(self, form, documentation_form):
        return self.render_to_response(self.get_context_data(form=form, documentation_form=documentation_form))

    def get_success_url(self):
        return reverse('parts:parts_detail', args=(self.object.id, ))


class PartsDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    model = Part
    success_url = reverse_lazy('parts:parts_list')
    permission_required = 'parts.add_part'
    redirect_field_name = 'home'

    def get_success_url(self):
        if self.kwargs.get('parent_pk'):
            return reverse('parts:parts_detail', args=(self.kwargs['parent_pk'], self.kwargs['current_location']))
        else:
            return reverse_lazy('parts:parts_list')


# Part Types Template Views

# AJAX Views

class PartsTypeAjaxDetailView(LoginRequiredMixin , DetailView):
    model = PartType
    context_object_name = 'part_type'
    template_name='parts/ajax_part_type_detail.html'
    redirect_field_name = 'home'
