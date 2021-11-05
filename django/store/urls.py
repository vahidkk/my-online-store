from django.urls import path
from django.urls.conf import include
from rest_framework_nested import routers
from . import views


app_name = "store"

urlpatterns = [
    path("api/category/", views.CategoryListView.as_view(), name="categories"),
    path(
        "api/category/<path:url>",
        views.CategoryItemView.as_view(),
        name="category_item",
    ),
]


router = routers.DefaultRouter()
router.register("api/products", views.ProductViewSet, basename="products")
router.register("api/carts", views.CartViewSet)

products_router = routers.NestedDefaultRouter(router, "api/products", lookup="product")
products_router.register("reviews", views.ReviewViewSet, basename="product-reviews")

carts_router = routers.NestedDefaultRouter(router, "api/carts", lookup="cart")
carts_router.register("items", views.CartItemViewSet, basename="cart-items")

urlpatterns = urlpatterns + router.urls + carts_router.urls + products_router.urls
