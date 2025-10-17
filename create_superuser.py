#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cini_storyboard.settings')
django.setup()

from django.contrib.auth.models import User

# Create or update superuser with your credentials
username = 'Mukundan'
email = 'mukundan@example.com'
password = 'Djsc@123'

try:
    # Try to get existing user
    user = User.objects.get(username=username)
    user.set_password(password)
    user.is_superuser = True
    user.is_staff = True
    user.email = email
    user.save()
    print(f"Updated existing user: {username}")
except User.DoesNotExist:
    # Create new superuser
    user = User.objects.create_superuser(
        username=username,
        email=email,
        password=password
    )
    print(f"Created new superuser: {username}")

print(f"Username: {username}")
print(f"Password: {password}")
print(f"Email: {email}")
print("You can now log in to Django admin at http://127.0.0.1:8000/admin/")