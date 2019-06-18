from django.urls import path

from . import views

app_name = 'assemblies'
urlpatterns = [
    path('', view=views.AssemblyHomeView.as_view(), name='assemblies_home'),
    # AJAX paths
    path('ajax/detail/<int:pk>/', view=views.AssemblyAjaxDetailView.as_view(), name='ajax_assemblies_detail'),
    path('ajax/add/', view=views.AssemblyAjaxCreateView.as_view(), name='ajax_assemblies_add'),
    path('ajax/edit/<int:pk>/', view=views.AssemblyAjaxUpdateView.as_view(), name='ajax_assemblies_update'),
    path('ajax/delete/<int:pk>/', view=views.AssemblyAjaxDeleteView.as_view(), name='ajax_assemblies_delete'),
    path('ajax/load-navtree/', views.load_assemblies_navtree, name='ajax_load_assemblies_navtree'),
]
