# Generated by Django 3.2.3 on 2022-05-23 21:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_rename_owner_configuration_owner_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='configuration',
            name='items',
            field=models.TextField(default='', max_length=40000),
        ),
    ]
