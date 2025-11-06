from datetime import datetime
from models.user_model import User, NotificationData

def complete_profile_notification(user: User) -> None:
    """
    Adds a notification to the user's notifications list indicating that their profile is complete.
    """
    if user.is_edited_by_user:
        notification_message = NotificationData(
            type="PROFILE_COMPLETED",
            date=datetime.utcnow(),
            message="Congratulations! You have completed your profile.",
            seen=False,
            status="complete"
        )
        user.notifications.append(notification_message)
        return user.notifications
    else :
        notification_message = NotificationData(
            type="PROFILE_INCOMPLETE",
            date=datetime.utcnow(),
            message="Please complete your profile to get the best experience.",
            seen=False,
            status="incomplete"
        )
        user.notifications.append(notification_message)
        return user.notifications

def new_message_notification(user: User) -> None:
    if True:  # Replace with actual condition to check for new messages
        notification_message = NotificationData(
            type="NEW_MESSAGE",
            date=datetime.utcnow(),
            message="You have received a new message.",
            seen=False,
            status="incomplete"
        )
        user.notifications.append(notification_message)
        return user.notifications