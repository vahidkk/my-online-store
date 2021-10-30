from django.db import models
from django.db.models import fields
from rest_framework import serializers

from .models import Category, Comments, Product, ProductImage
 

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image", "alt_text"]

class CategorySerializer(serializers.ModelSerializer):
    class Meta: 
        model = Category
        fields = ["name", "slug","url","paths"]


class ProductSerializer(serializers.ModelSerializer):
    product_image = ImageSerializer( many=True,read_only=True)
    category = CategorySerializer( read_only=True)

    class Meta:
        model = Product
        fields = ["id", "category", "title", "description", "slug", "regular_price", "product_image"]


class FileSerializer(serializers.ModelSerializer):

    key = serializers.CharField(source='slug') 
    label = serializers.CharField(source='name')
    class Meta: 
        model = Category
        fields=['key','label','url','level','paths']
    def get_fields(self):
        fields = super(FileSerializer, self).get_fields()
        fields['nodes'] = FileSerializer(many=True) #'nodes' is : related_name="nodes" (from parent field of MPTT on models).
        
        return fields


class CommentsSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = Comments
        fields= ['name','email','text','created_at','updated_at','product']