from django.core.validators import MinValueValidator
from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from mptt.models import MPTTModel, TreeForeignKey
from django.utils.text import slugify
import random
import string
from uuid import uuid4


def random_string_generator(size=4, chars=string.ascii_lowercase + string.digits):
    return "".join(random.choice(chars) for _ in range(size))


class Category(MPTTModel):

    name = models.CharField(
        ("Category Name"),
        help_text=_("Required and unique"),
        max_length=255,
        unique=True,
    )
    slug = models.SlugField(_("Category slug"), max_length=255, unique=True)
    url = models.CharField(
        _("nested path to this category"),
        max_length=200,
        default=" ",
        null=True,
        blank=True,
    )
    paths = models.JSONField(
        _("list of ancestors"), default=list, null=True, blank=True
    )
    parent = TreeForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="nodes"
    )
    is_active = models.BooleanField(default=True)

    class MPTTMeta:
        order_insertion_by = ["name"]

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")

    def get_absolute_url(self):
        return reverse("store:category_list", args=[self.slug])

    def __str__(self):
        return str(self.name)

    def save(self, *args, **kwargs):
        allData = Category.objects.all()

        def get_slugs_ancestors(self):
            listOfSlugs = []
            if self.parent_id:
                i = self.parent_id
                while isinstance(i, int):
                    lastAncestorRow = allData.get(id=i)
                    listOfSlugs.append(lastAncestorRow.slug)
                    i = lastAncestorRow.parent_id
            listOfSlugs.insert(0, self.slug)
            return listOfSlugs[::-1]

        allData = Category.objects.all()
        self.paths = get_slugs_ancestors(self)
        self.url = "/".join([str(x) for x in get_slugs_ancestors(self)])
        super().save(*args, **kwargs)


class ProductType(models.Model):

    name = models.CharField(
        _("Product Name"), help_text=_("Required"), max_length=255, unique=True
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = _("Product Type")
        verbose_name_plural = _("Product Types")

    def __str__(self):
        return self.name


class ProductSpecification(models.Model):

    product_type = models.ForeignKey(ProductType, on_delete=models.RESTRICT)
    name = models.CharField(
        verbose_name=_("Name"), help_text=_("Required"), max_length=255
    )

    class Meta:
        verbose_name = _("Product Specification")
        verbose_name_plural = _("Product Specifications")

    def __str__(self):
        return self.name


class Product(models.Model):

    product_type = models.ForeignKey(ProductType, on_delete=models.RESTRICT)
    category = models.ForeignKey(Category, on_delete=models.RESTRICT)
    title = models.CharField(
        verbose_name=_("title"),
        help_text=_("Required"),
        max_length=255,
    )
    description = models.TextField(
        verbose_name=_("description"), help_text=_("Not Required"), blank=True
    )
    slug = models.SlugField(max_length=255, blank=True, default=None)
    regular_price = models.DecimalField(
        verbose_name=_("Regular price"),
        help_text=_("Maximum 999.99"),
        error_messages={
            "name": {
                "max_length": _("The price must be between 0 and 999.99."),
            },
        },
        max_digits=5,
        decimal_places=2,
    )
    discount_price = models.DecimalField(
        verbose_name=_("Discount price"),
        help_text=_("Maximum 999.99"),
        error_messages={
            "name": {
                "max_length": _("The price must be between 0 and 999.99."),
            },
        },
        max_digits=5,
        decimal_places=2,
    )
    is_active = models.BooleanField(
        verbose_name=_("Product visibility"),
        help_text=_("Change product visibility"),
        default=True,
    )
    available_quantity = models.PositiveIntegerField(
        verbose_name=_("Available Quantity in the store"),
        default=10,
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(
        _("Created at"), auto_now_add=True, editable=False
    )
    updated_at = models.DateTimeField(_("Updated at"), auto_now=True)

    class Meta:
        ordering = ("-created_at",)
        verbose_name = _("Product")
        verbose_name_plural = _("Products")

    def get_absolute_url(self):
        return reverse("store:product_detail", args=[self.slug])

    def __str__(self):
        return str(self.title)

    def save(self, *args, **kwargs):
        currentSlug = slugify(self.title)
        qs_exists = Product.objects.filter(slug=currentSlug).exists()
        if qs_exists:
            newSlug = "{slug}-{randstr}".format(
                slug=currentSlug, randstr=random_string_generator(size=4)
            )
        else:
            newSlug = currentSlug
        self.slug = newSlug
        super().save(*args, **kwargs)


class ProductSpecificationValue(models.Model):

    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    specification = models.ForeignKey(ProductSpecification, on_delete=models.RESTRICT)
    value = models.CharField(
        verbose_name=_("value"),
        help_text=_("Product specification value (maximum of 250 words"),
        max_length=250,
    )

    class Meta:
        verbose_name = _("Product Specification Value")
        verbose_name_plural = _("Product Specification Values")

    def __str__(self):
        return self.value


class ProductImage(models.Model):

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="product_image"
    )
    image = models.ImageField(
        verbose_name=_("image"),
        help_text=_("Upload a product image"),
        upload_to="images/",
        default="images/default.png",
    )
    alt_text = models.CharField(
        verbose_name=_("Alternative text"),
        help_text=_("Please add alternative text"),
        max_length=255,
        null=True,
        blank=True,
    )
    is_feature = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Product Image")
        verbose_name_plural = _("Product Images")


class Comments(models.Model):

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="reviews"
    )
    text = models.TextField(verbose_name=_("comment"), blank=False)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)
    name = models.CharField(verbose_name=_("name"), max_length=50, blank=False)
    email = models.EmailField(max_length=254, blank=False)

    class Meta:
        verbose_name = _("Comment")
        verbose_name_plural = _("Comments")

    def __str__(self):
        return self.name


class Cart(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid4)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    edited_at = models.DateTimeField(auto_now=True, auto_now_add=False)

    def __str__(self):
        return str(self.id)


class CartItem(models.Model):
    quantity = models.PositiveSmallIntegerField(
        verbose_name=_("Quantity"), validators=[MinValueValidator(1)]
    )
    product = models.ForeignKey(
        Product, verbose_name=_("Product Name"), on_delete=models.CASCADE
    )
    cart = models.ForeignKey(
        Cart, verbose_name=_("Cart ID"), on_delete=models.CASCADE, related_name="itemss"
    )

    class Meta:
        unique_together = [["product", "cart"]]

    def __str__(self):
        return str(self.product)
