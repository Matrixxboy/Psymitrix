from datetime import datetime
from models.user_model import User, NotificationData , NotificationType , NotificationStatus

def create_notification(user: User, type: NotificationType, notification_name: str, message: str, status: NotificationStatus = NotificationStatus.incomplete) -> list:
    """
    Creates a new notification and returns an updated list of notifications.
    """
    notification_message = NotificationData(
        type=type,
        notification_name=notification_name,
        message=message,
        status=status
    )
    new_notifications = user.notifications + [notification_message]
    return [n.model_dump(mode='json') for n in new_notifications]

def complete_profile_notification(user: User) -> list:
    """
    Adds a notification to the user's notifications list indicating that their profile is complete.
    """
    if user.is_edited_by_user:
        return create_notification(
            user=user,
            type=NotificationType.PROFILE_COMPLETE,
            notification_name="Profile Completion",
            message="Congratulations! You have completed your profile.",
            status=NotificationStatus.completed
        )
    else :
        return create_notification(
            user=user,
            type=NotificationType.PROFILE_INCOMPLETE,
            notification_name="Profile Incompletion",
            message="Please complete your profile to get the best experience.",
            status=NotificationStatus.incomplete
        )

def new_message_notification(user: User) -> list:
    """
    Adds a notification for a new message.
    """
    if True:  # Replace with actual condition to check for new messages
        return create_notification(
            user=user,
            type=NotificationType.NEW_MESSAGE,
            notification_name="New Message",
            message="You have received a new message.",
            status=NotificationStatus.incomplete
        )
    # If no new message, return the existing notifications
    return [n.model_dump(mode='json') for n in user.notifications]