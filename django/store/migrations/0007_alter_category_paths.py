# Generated by Django 3.2.8 on 2021-10-28 05:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0006_alter_category_paths'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='paths',
            field=models.CharField(max_length=200, null=True, verbose_name='list of ancestor categories'),
        ),
    ]
