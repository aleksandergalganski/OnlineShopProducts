from django.db import models


class ProductQuerySet(models.QuerySet):
    def get_products_by_name(self, name):
        return self.filter(name__contains=name)

    def get_products_by_category(self, category):
        return self.filter(category__name=category)

    def get_available(self):
        return self.filter(avaialable=True)

    def get_products_by_manufacturer(self, manufacturer):
        return self.filter(manufacturer__name=manufacturer)

    def get_products_cheaper_than(self, price):
        return self.filter(price__lte=price)

    def get_products_more_expensive_than(self, price):
        return self.filter(price__gte=price)

    def asc_order(self):
        return self.order_by('created')

    def desc_order(self):
        return self.order_by('-created')


class ProductManager(models.Manager):
    def get_queryset(self):
        return ProductQuerySet(self.model, using=self._db)

    def get_products_by_name(self, name):
        return self.get_queryset().get_products_by_name(name)

    def get_products_by_category(self, category):
        return self.get_queryset().get_products_by_category(category)

    def get_available(self):
        return self.get_queryset().get_available()

    def get_products_by_manufacturer(self, manufacturer):
        return self.get_queryset()

    def get_products_cheaper_than(self, price):
        return self.get_queryset()

    def get_products_more_expensive_than(self, price):
        return self.get_queryset()

    def asc_order(self):
        return self.get_queryset()

    def desc_order(self):
        return self.get_queryset()
