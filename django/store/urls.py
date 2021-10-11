# created by me !
# created by me !
# created by me !
# created by me !
# created by me !
# created by me !
# created by me !
# created by me !

from django.urls import path
from . import views
app_name= "store"
urlpatterns = [
    path("api/", views.ProductListView.as_view(), name="store_home"),
]
# when the nextjs is trying to reach this url ( /api ) , it's basically going to return from the  view all the data from the database so all the products  
