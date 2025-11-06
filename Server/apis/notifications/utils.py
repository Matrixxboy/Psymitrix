from datetime import datetime
from models.user_model import User, NotificationData , NotificationType , NotificationStatus

def complete_profile_notification(user: User) -> None:
    """
    Adds a notification to the user's notifications list indicating that their profile is complete.
    """
    if user.is_edited_by_user:
        notification_message = NotificationData(
            type=NotificationType.PROFILE_COMPLETE,
            date=datetime.utcnow(),
            message="Congratulations! You have completed your profile.",
            seen=False,
            status=NotificationStatus.completed
        )
        user.notifications.append(notification_message)
        return user.notifications
    else :
        notification_message = NotificationData(
            type=NotificationType.PROFILE_INCOMPLETE,
            date=datetime.utcnow(),
            message="Please complete your profile to get the best experience.",
            seen=False,
            status=NotificationStatus.incomplete
        )
        user.notifications.append(notification_message)
        return user.notifications

def new_message_notification(user: User) -> None:
    if True:  # Replace with actual condition to check for new messages
        notification_message = NotificationData(
            type=NotificationType.NEW_MESSAGE,
            date=datetime.utcnow(),
            message="You have received a new message.",
            seen=False,
            status=NotificationStatus.incomplete
        )
        user.notifications.append(notification_message)
        return user.notifications