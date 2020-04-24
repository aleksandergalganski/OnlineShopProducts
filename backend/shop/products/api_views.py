from .models import Product, Category, Manufacturer
from .serializers import ProductSerializer, CategorySerializer, ManufacturerSerializer

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination


class StandardResultsPagination(PageNumberPagination):
    page_size = 20
    page_query_param = 'page_size'
    max_page_size = 22


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_fields = {
        'price': ['gte', 'lte'],
        'category': ['exact'],
        'manufacturer': ['exact']
    }
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter,
                       filters.SearchFilter]
    ordering_fields = ['price', 'name']
    search_fields = ['name']
    pagination_class = StandardResultsPagination


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ManufacturerViewSet(viewsets.ModelViewSet):
    queryset = Manufacturer.objects.all()
    serializer_class = ManufacturerSerializer
