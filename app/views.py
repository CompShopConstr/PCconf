from django.shortcuts import render
from django.views import View


class FrontendTemplateView(View):
  def get(self, request):
       return render(request, 'index.html')
  def post(self, request):
    return render(request, 'index.html')