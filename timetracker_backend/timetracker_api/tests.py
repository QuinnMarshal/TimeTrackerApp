from django.test import TestCase
from timetracker_api.models import TimeEntry, AppUser

# AppUserTestCase class is created to test the AppUser model
# The setUp() method is created to set up the user data
# The test_user_creation() method is created to test the user creation
class AppUserTestCase(TestCase):
    def setUp(self):
        self.user = AppUser.objects.create_user(email="test@test.com", username="test", password="test")
        self.superuser = AppUser.objects.create_superuser(email="admin@test.com", username="admin", password="admin") 

    def test_user_creation(self):
        self.assertEqual(self.user.email, "test@test.com")
        self.assertEqual(self.user.username, "test")
        self.assertTrue(self.user.user_id)
        self.assertFalse(self.user.is_superuser)

        # Test that the email is unique
        with self.assertRaises(Exception):
            AppUser.objects.create_user(email="test@test.com", password="test2")

    def test_superuser_creation(self):
        self.assertEqual(self.superuser.email, "admin@test.com")
        self.assertEqual(self.superuser.username, "admin")
        self.assertTrue(self.superuser.user_id)
        self.assertTrue(self.superuser.is_superuser)


# TimeEntryTestCase class is created to test the TimeEntry model
# The setUp() method is created to set up the time entry data
# The test_time_entry() method is created to test the time entry creation
class TimeEntryTestCase(TestCase):
    def setUp(self):
       self.user = AppUser.objects.create_user(email="test2@test.com", username="test2", password="test2")
       self.time_entry = TimeEntry.objects.create(user=self.user, project=1, hours_worked=5, description="Test Time Entry")

    def test_time_entry(self):
        self.assertEqual(self.time_entry.user, self.user)
        self.assertEqual(self.time_entry.project, 1)
        self.assertEqual(self.time_entry.hours_worked, 5)
        self.assertEqual(self.time_entry.description, "Test Time Entry")
        self.assertTrue(self.time_entry.entry_timestamp)
        self.assertTrue(self.time_entry.time_entry_id)