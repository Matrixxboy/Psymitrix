from models.user_model import User, achievementsData
from datetime import datetime
from typing import List

def check_and_add_achievement(user: User, achievement_name: str, description: str) -> bool:
    """
    Generic function to check if an achievement exists and add it if it doesn't.
    Returns True if the achievement was added, False otherwise.
    """
    if not any(ach.achievement_name == achievement_name for ach in user.achievements):
        achievement = achievementsData(
            achievement_name=achievement_name,
            description=description,
            date_achieved=datetime.utcnow()
        )
        user.achievements.append(achievement)
        return True
    return False

def check_all_achievements(user: User) -> List[str]:
    """
    Checks all possible achievements for a user and adds them if criteria are met.
    Returns a list of newly awarded achievement names.
    """
    newly_added = []

    # 1. First Login
    if check_and_add_achievement(user, "First_Login", "You logged in for the first time!"):
        newly_added.append("First Login")

    # 2. Streak Achievements
    if user.streak >= 7 and check_and_add_achievement(user, "7_Day_Streak", "Maintained a login streak for 7 consecutive days!"):
        newly_added.append("7 Day Streak")
    if user.streak >= 14 and check_and_add_achievement(user, "14_Day_Streak", "Kept up a 2-week login streak!"):
        newly_added.append("14 Day Streak")
    if user.streak >= 30 and check_and_add_achievement(user, "30_Day_Streak", "Achieved a 1-month login streak!"):
        newly_added.append("30 Day Streak")

    # 3. Assessment Achievements
    if len(user.mental_health_profile.assessment_results) > 0 and check_and_add_achievement(user, "First_Assessment", "Completed your first mental health assessment!"):
        newly_added.append("First Assessment")
    
    # 4. Profile Completion
    if user.is_edited_by_user and check_and_add_achievement(user, "Profile_Complete", "Completed your user profile!"):
        newly_added.append("Profile Complete")
        
    # 5. First Mood Entry
    if len(user.mood_trends) > 0 and check_and_add_achievement(user, "First_Mood_Entry", "Tracked your mood for the first time!"):
        newly_added.append("First Mood Entry")

    return newly_added
