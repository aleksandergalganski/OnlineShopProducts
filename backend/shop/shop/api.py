from rest_framework import routers

from products import api_views as products_views


router = routers.DefaultRouter()
router.register(r'products', products_views.ProductViewSet)
router.register(r'categories', products_views.CategoryViewSet)
router.register(r'manufacturers', products_views.ManufacturerViewSet)
