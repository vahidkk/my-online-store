from django.contrib import admin
from django.contrib.admin.options import ModelAdmin

# Register your models here.

from mptt.admin import MPTTModelAdmin

from .models import (
    Category,
    Product,
    ProductImage,
    ProductSpecification,
    ProductSpecificationValue,
    ProductType,
    Comments,
)

# class BookAdmin(admin.ModelAdmin):
#   prepopulated_fields = {"slug": ("title",)}

# admin.site.register(Book, BookAdmin)



admin.site.register(Category, MPTTModelAdmin)

admin.site.register(Comments)

class ProductSpecificationInline(admin.TabularInline):
    model = ProductSpecification


@admin.register(ProductType)
class ProductTypeAdmin(admin.ModelAdmin):
    inlines = [
        ProductSpecificationInline,
    ]


class ProductImageInline(admin.TabularInline):
    model = ProductImage


class ProductSpecificationValueInline(admin.TabularInline):
    model = ProductSpecificationValue


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [
        ProductSpecificationValueInline,
        ProductImageInline,
    ]
    prepopulated_fields = {"slug": ("title",)}