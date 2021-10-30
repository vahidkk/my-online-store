
from django.db.models.query import QuerySet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework import generics
from rest_framework import viewsets
from . import models
from .models import Category, Comments, Product
from .serializers import  CommentsSerializer, ProductSerializer , FileSerializer
from .filters import ProductFilter
from .paginations import CustomPagination

# Create your views here. 

class ProductListView(generics.ListAPIView): 
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends=[SearchFilter,DjangoFilterBackend,OrderingFilter]
    filterset_class= ProductFilter
    search_fields= ['title','description']
    ordering_fields= ['regular_price', 'updated_at']
    pagination_class = CustomPagination
    
class Product(generics.RetrieveAPIView):
    lookup_field = "slug"
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class CategoryItemView(generics.ListAPIView):
    serializer_class = ProductSerializer 
    filter_backends=[SearchFilter,DjangoFilterBackend,OrderingFilter]
    filterset_class= ProductFilter
    pagination_class = CustomPagination
    search_fields= ['title','description']
    ordering_fields= ['regular_price', 'updated_at']
    def get_queryset(self):
        return models.Product.objects.filter(
            category__in=Category.objects.get(url=self.kwargs["url"]).get_descendants(include_self=True)
        )

class CategoryListView(generics.ListAPIView):
    # queryset = Category.objects.all()
    serializer_class = FileSerializer
    def get_queryset(self): 
        return Category.objects.filter(level=0)


class CommentsRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    lookup_field='product__slug'
    serializer_class = CommentsSerializer
    def get_queryset(self):
        return Comments.objects.filter(product__slug=self.kwargs['product__slug'])

class CommentsListView(generics.ListAPIView):
    serializer_class = CommentsSerializer
    queryset = Comments.objects.all()