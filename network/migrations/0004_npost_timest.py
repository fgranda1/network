# Generated by Django 3.0.7 on 2020-07-21 22:28

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0003_like'),
    ]

    operations = [
        migrations.AddField(
            model_name='npost',
            name='timest',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
