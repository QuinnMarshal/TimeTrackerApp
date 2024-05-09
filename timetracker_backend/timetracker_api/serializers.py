from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate

# The get_user_model() function returns the user model that is active in the current project
UserModel = get_user_model()

# UserRegistrationSerializer class is created to serialize the user registration data
# The create() method is overridden to create a user object with the validated data
class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = "__all__"
    
    def create(self, validated_data):
        user_obj = UserModel.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"]
        )
        user_obj.username=validated_data["username"]
        user_obj.save()
        return user_obj
    
# UserLoginSerializer class is created to serialize the user login data
# The check_user() method is created to authenticate the user with the validated data
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def check_user(self, validated_data):
        email = validated_data.get("email")
        password = validated_data.get("password")
        
        if email and password:
            user = authenticate(email=email, password=password)
            if not user:
                raise serializers.ValidationError("Invalid Credentials")
        else:
            raise serializers.ValidationError("Email and Password are required")
        
        return user
    
# UserSerializer class is created to serialize the user data
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["user_id", "email", "username"]