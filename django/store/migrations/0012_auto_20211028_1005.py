# Generated by Django 3.2.8 on 2021-10-28 06:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0011_auto_20211028_0939'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='url',
            field=models.FilePathField(blank=True, max_length=200, null=True, path=None, verbose_name=''),
        ),
        migrations.AlterField(
            model_name='category',
            name='paths',
            field=models.JSONField(default=list, null=True, verbose_name='pppp'),
        ),
    ]