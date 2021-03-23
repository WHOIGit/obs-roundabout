# Generated by Django 3.1.3 on 2021-01-12 19:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0056_inventorydeployment_assembly_part'),
    ]

    operations = [
        migrations.AlterField(
            model_name='action',
            name='action_type',
            field=models.CharField(choices=[('add', 'Added to RDB'), ('update', 'Details updated'), ('locationchange', 'Location Change'), ('subchange', 'Sub-Assembly Change'), ('addtobuild', 'Add to Build'), ('removefrombuild', 'Remove from Build'), ('startdeployment', 'Start Deployment'), ('removefromdeployment', 'Deployment Ended'), ('deploymentburnin', 'Deployment Burnin'), ('deploymenttofield', 'Deployment to Field'), ('deploymentupdate', 'Deployment Update'), ('deploymentrecover', 'Deployment Recovery'), ('deploymentretire', 'Deployment Retired'), ('deploymentdetails', 'Deployment Details Updated'), ('assigndest', 'Assign Destination'), ('removedest', 'Remove Destination'), ('test', 'Test'), ('note', 'Note'), ('historynote', 'Historical Note'), ('ticket', 'Work Ticket'), ('fieldchange', 'Field Change'), ('flag', 'Flag'), ('movetotrash', 'Move to Trash'), ('retirebuild', 'Retire Build'), ('reviewapprove', 'Reviewer approved Event'), ('eventapprove', 'Event Approved'), ('calcsvimport', 'Calibration CSV Uploaded'), ('calcsvupdate', 'Updated by Calibration CSV')], db_index=True, max_length=20),
        ),
    ]