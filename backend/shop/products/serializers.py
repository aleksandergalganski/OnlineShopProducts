from .models import Product, Category, Manufacturer

from rest_framework import serializers


class ManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manufacturer
        fields = ('id', 'name', 'country')


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(many=False)
    manufacturer = ManufacturerSerializer(many=False)

    class Meta:
        model = Product
        fields = ('id', 'name', 'image', 'category', 'manufacturer',
                  'quantity', 'price', 'available', 'created')

