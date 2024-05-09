from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone

# AppUserManager and AppUser classes are created to override the default User model of Django
# AppUserManager class is created to manage the creation of users
class AppUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError("The Email field must be set")
        if not password:
            raise ValueError("The Password field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, email, password=None):
        user = self.create_user(email, password)
        user.is_superuser = True
        user.save()
        return user
    
# AppUser class is created to add the user_id field
class AppUser(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=50, unique=True)
    username = models.CharField(max_length=50)
    
    objects = AppUserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    
    def __str__(self):
        return self.username
    
# TimeEntry class is created to store the time entry data
# This is for users to enter the time they have worked on a project
class TimeEntry(models.Model):
    time_entry_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    project = models.IntegerField()
    hours_worked = models.DecimalField(max_digits=5, decimal_places=2)
    description = models.TextField()
    entry_timestamp = models.DateTimeField(default=timezone.now)  # timestamp of when the entry was made
    
    def __str__(self):
        return self.description