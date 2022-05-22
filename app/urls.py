from rest_framework import routers
from .views import UserViewSet, ConfigurationViewSet


router = routers.DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'configuration', ConfigurationViewSet)

urlpatterns = router.urls
