# Generated by Django 5.1.7 on 2025-03-10 22:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blabbery', '0001_initial'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='user',
            name='unique_username',
        ),
    ]
