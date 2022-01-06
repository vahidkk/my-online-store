from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.mixins import (
    CreateModelMixin,
    DestroyModelMixin,
    RetrieveModelMixin,
    ListModelMixin,
)
from . import models
from .models import CartItem, Cart, Category, Comments, Product
from .serializers import (
    AddCartItemSerializer,
    CartItemSerializer,
    CartSerializer,
    UpdateCartItemSerializer,
    ProductViewSetSerializer,
    ReviewSerializer,
    FileSerializer,
    CategorySerializer,
)
from .filters import ProductFilter
from .paginations import CustomPagination

# Create your views here.


class CategoryItemView(generics.ListAPIView):
    serializer_class = ProductViewSetSerializer
    filter_backends = [SearchFilter, DjangoFilterBackend, OrderingFilter]
    filterset_class = ProductFilter
    pagination_class = CustomPagination
    search_fields = ["title", "description"]
    ordering_fields = ["regular_price", "updated_at"]

    def get_queryset(self):
        return models.Product.objects.filter(
            category__in=Category.objects.get(url=self.kwargs["url"]).get_descendants(
                include_self=True
            )
        )


class CategoryListView(generics.ListAPIView):
    serializer_class = FileSerializer

    def get_queryset(self):
        return Category.objects.filter(level=0)


class AllCategoriesListView(generics.ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.all()


class ProductViewSet(ModelViewSet):
    lookup_field = "slug"
    queryset = models.Product.objects.all()
    serializer_class = ProductViewSetSerializer
    filter_backends = [SearchFilter, DjangoFilterBackend, OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ["title", "description"]
    ordering_fields = ["regular_price", "updated_at"]
    pagination_class = CustomPagination

    def get_serializer_context(self):
        return {"request": self.request}


class ReviewViewSet(ModelViewSet):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        return Comments.objects.filter(
            product_id=models.Product.objects.get(slug=self.kwargs["product_slug"])
        )

    def get_serializer_context(self):
        return {"product_slug": self.kwargs["product_slug"]}


class CartViewSet(
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    DestroyModelMixin,
    GenericViewSet,
):
    queryset = Cart.objects.prefetch_related("itemss__product").all()
    serializer_class = CartSerializer


class CartItemViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "delete"]  # just removed put button

    def get_serializer_class(self):
        if self.request.method == "POST":
            return AddCartItemSerializer
        elif self.request.method == "PATCH":
            return UpdateCartItemSerializer
        return CartItemSerializer

    def get_serializer_context(self):
        return {"cart_id": self.kwargs["cart_pk"]}

    def get_queryset(self):
        return models.CartItem.objects.filter(
            cart_id=self.kwargs["cart_pk"]
        ).select_related("product")
