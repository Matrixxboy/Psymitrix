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

def update_notification_as_seen(user: User, notification_id: str) -> list:
    """
    Marks a notification as seen based on its ID and returns the updated list of notifications.
    """
    updated_notifications = []
    for n in user.notifications:
        if str(n.notification_id) == notification_id:
            n.seen = True
        updated_notifications.append(n)
    return [n.model_dump(mode='json') for n in updated_notifications]

def complete_profile_notification(user: User) -> list:
    """
    Adds or updates a notification about profile completion status.
    Ensures there is only one notification regarding profile status.
    """
    # Filter out existing profile notifications
    other_notifications = [n for n in user.notifications if n.type not in [NotificationType.PROFILE_COMPLETE, NotificationType.PROFILE_INCOMPLETE]]

    if user.is_edited_by_user:
        # Add a 'complete' notification                
        notification_message = NotificationData(
            type=NotificationType.PROFILE_COMPLETE,
            notification_name="Profile Completion",
            message="Congratulations! You have completed your profile.",
            status=NotificationStatus.completed
        )
        final_notifications = other_notifications + [notification_message]
    else:
        # Add an 'incomplete' notification
        notification_message = NotificationData(
            type=NotificationType.PROFILE_INCOMPLETE,
            notification_name="Profile Incompletion",
            message="Please complete your profile to get the best experience.",
            status=NotificationStatus.incomplete
        )
        final_notifications = other_notifications + [notification_message]

    return [n.model_dump(mode='json') for n in final_notifications]

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