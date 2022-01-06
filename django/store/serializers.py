from rest_framework import serializers
from .models import Cart, CartItem, Category, Comments, ProductImage, Product


class CategorySerializer(serializers.ModelSerializer):
    price_range = serializers.SerializerMethodField()

    def get_price_range(self, cat):
        sorted_regular_prices = sorted(
            [
                list(i.values())[0]
                for i in Category.objects.filter(id=cat.id)
                .get_descendants(include_self=True)
                .values("product__regular_price")
                if list(i.values())[0]
            ]
        )
        return {
            "min_price": sorted_regular_prices[0]
            if len(sorted_regular_prices) > 0
            else 0,
            "max_price": sorted_regular_prices[-1]
            if len(sorted_regular_prices) > 0
            else 0,
        }

        # [
        #     list(i.values())[0]
        #     for i in Category.objects.filter(id=cat.id)
        #     .get_descendants(include_self=True)
        #     .values("product__regular_price")
        #     if list(i.values())[0]
        # ]

    class Meta:
        model = Category
        fields = ["name", "price_range", "slug", "url", "paths"]


class FileSerializer(serializers.ModelSerializer):

    key = serializers.CharField(source="slug")
    label = serializers.CharField(source="name")
    # price_range = CategorySerializer()

    # def get_price_range(self, cat):
    #     sorted_regular_prices = sorted(
    #         [
    #             list(i.values())[0]
    #             for i in cat.get_descendants(include_self=True).values(
    #                 "product__regular_price"
    #             )
    #             if list(i.values())[0]
    #         ]
    #     )
    #     return {
    #         "min_price": sorted_regular_prices[0],
    #         "max_price": sorted_regular_prices[-1],
    #     }

    def get_fields(self):
        fields = super(FileSerializer, self).get_fields()
        fields["nodes"] = FileSerializer(many=True)
        #'nodes' is : related_name="nodes" (from parent field of MPTT on models).
        return fields

    class Meta:
        model = Category
        fields = [
            "key",
            "label",
            "url",
            "level",
            "paths",
        ]


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image", "alt_text"]


class ProductViewSetSerializer(serializers.ModelSerializer):
    product_image = ImageSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "title",
            "description",
            "slug",
            "regular_price",
            "product_image",
            "available_quantity",
            "available_quantity",
        ]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comments
        fields = ["name", "email", "text", "created_at", "updated_at"]

    def create(self, validated_data):
        product_slug = self.context["product_slug"]
        return Comments.objects.create(
            product_id=Product.objects.get(slug=product_slug).id, **validated_data
        )


class SimpleProductSerializer(serializers.ModelSerializer):
    product_image = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "regular_price",
            "slug",
            "product_image",
            "available_quantity",
        ]


class CartItemSerializer(serializers.ModelSerializer):
    product = SimpleProductSerializer()
    total_price = serializers.SerializerMethodField()

    def get_total_price(self, cart_item: CartItem):
        return cart_item.quantity * cart_item.product.regular_price

    class Meta:
        model = CartItem
        fields = ["id", "product", "quantity", "total_price"]


class CartSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    itemss = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    def get_total_price(self, cart):
        return sum(
            [item.quantity * item.product.regular_price for item in cart.itemss.all()]
        )

    class Meta:
        model = Cart
        fields = ["id", "itemss", "total_price"]


class AddCartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField()

    def validate_product_id(self, value):
        if not Product.objects.filter(pk=value).exists():
            raise serializers.ValidationError("No product with the given ID was found.")
        return value

    def save(self, **kwargs):
        cart_id = self.context["cart_id"]
        product_id = self.validated_data["product_id"]
        quantity = self.validated_data["quantity"]

        try:
            cart_item = CartItem.objects.get(cart_id=cart_id, product_id=product_id)
            cart_item.quantity += quantity
            cart_item.save()
            self.instance = cart_item
        except CartItem.DoesNotExist:
            self.instance = CartItem.objects.create(
                cart_id=cart_id, **self.validated_data
            )

        return self.instance

    class Meta:
        model = CartItem
        fields = ["id", "product_id", "quantity"]


class UpdateCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ["quantity"]
