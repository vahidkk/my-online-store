# Generated by Django 3.2.8 on 2021-10-28 04:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0003_auto_20211028_0729'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='category',
            name='path',
        ),
        migrations.AddField(
            model_name='category',
            name='paths',
            field=models.JSONField(default=[], null=True, verbose_name='list of ancestor categories'),
        ),
    ]
