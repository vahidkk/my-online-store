# Generated by Django 3.2.8 on 2021-10-28 05:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0005_alter_category_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='paths',
            field=models.JSONField(default=list, null=True, verbose_name='list of ancestor categories'),
        ),
    ]