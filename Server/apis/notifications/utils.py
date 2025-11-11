from datetime import datetime, timedelta
from models.user_model import User, NotificationData, NotificationType, NotificationStatus
from apis.achievements.utils import check_all_achievements
from typing import List

def create_notification(user: User, type: NotificationType, notification_name: str, message: str, status: NotificationStatus = NotificationStatus.incomplete):
    """
    Creates a new notification and adds it to the user's notification list.
    """
    # Prevents duplicate notifications
    for n in user.notifications:
        if n.notification_name == notification_name and n.message == message:
            return

    notification_message = NotificationData(
        type=type,
        notification_name=notification_name,
        message=message,
        status=status
    )
    user.notifications.append(notification_message)

def update_notification_as_seen(user: User, notification_id: str) -> list:
    """
    Marks a notification as seen based on its ID and returns the updated list of notifications.
    """
    for n in user.notifications:
        if str(n.notification_id) == notification_id:
            n.seen = True
    return [n.model_dump(mode='json') for n in user.notifications]

def check_and_add_notifications(user: User):
    """
    Central function to check for and add all relevant notifications.
    """
    # 1. Achievement Notifications
    newly_added_achievements = check_all_achievements(user)
    for ach_name in newly_added_achievements:
        create_notification(
            user=user,
            type=NotificationType.ACHIEVEMENT_UNLOCKED,
            notification_name="Achievement Unlocked!",
            message=f"You've unlocked the '{ach_name}' achievement!"
        )

    # 2. Profile Completion Notification
    # Remove existing profile notifications to avoid duplicates
    user.notifications = [n for n in user.notifications if n.type not in [NotificationType.PROFILE_COMPLETE, NotificationType.PROFILE_INCOMPLETE]]
    if user.is_edited_by_user:
        create_notification(
            user=user,
            type=NotificationType.PROFILE_COMPLETE,
            notification_name="Profile Complete",
            message="Your profile is complete. Great job!",
            status=NotificationStatus.completed
        )
    else:
        create_notification(
            user=user,
            type=NotificationType.PROFILE_INCOMPLETE,
            notification_name="Complete Your Profile",
            message="Complete your profile to get personalized insights.",
            status=NotificationStatus.incomplete
        )
        
    # 3. Assessment Reminder
    # Remind user to take an assessment if they haven't in 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_assessments = [
        a for a in user.mental_health_profile.assessment_results 
        if a.date >= thirty_days_ago
    ]
    if not recent_assessments:
        create_notification(
            user=user,
            type=NotificationType.ASSESSMENT_REMINDER,
            notification_name="Assessment Reminder",
            message="It's been a while! Take a quick assessment to track your progress."
        )
