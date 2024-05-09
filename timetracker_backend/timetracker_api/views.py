from django.shortcuts import render
from django.contrib.auth import get_user_model, login, logout
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework import status, permissions
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer, TimeEntrySerializer
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication

# UserRegister class is created to register a new user
# The post() method is created to register a new user with the validated data
class UserRegister(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            
            token = Token.objects.create(user=user)
            
            return Response({'user': serializer.data, 'token': token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# UserLogin class is created to login a user
# The post() method is created to login a user with the validated data
class UserLogin(APIView):  
    permission_classes = [permissions.AllowAny]
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    
    def post(self, request):
        data = request.data
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'id': user.user_id, **serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# UserLogout class is created to logout a user
class UserLogout(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = ()
    
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
     
# UserList class is created to get the user data
class UserList(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({"user": serializer.data}, status=status.HTTP_200_OK)
    
# TimeEntryList class is created to get the time entry data
# The get() method is created to get all the time entries of a user
# The post() method is created to create a new time entry for a user
class TimeEntryList(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        serializer = TimeEntrySerializer(request.user.timeentry_set.all(), many=True)
        return Response({"timeentry": serializer.data}, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = TimeEntrySerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    