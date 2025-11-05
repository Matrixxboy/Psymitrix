from models.user_model import User, achievementsData, Achievements

def check_and_add_first_login_achievement(user: User) -> bool:
    """
    Checks if the 'First Login' achievement should be awarded and adds it to the user's achievements.
    Returns True if the achievement was added, False otherwise.
    """
    if not any(ach.achievement_name == "First_Login" for ach_list in user.achievements for ach in ach_list.achievements):
        first_login_achievement = achievementsData(
            achievement_name="First_Login",
            description="You logged in for the first time!"
        )
        if not user.achievements:
            user.achievements = [Achievements(achievements=[])]
        user.achievements[0].achievements.append(first_login_achievement)
        return True
    return False


def check_and_add_streak_achievement(user: User, streak_count: int) -> bool:
    if streak_count >= 7 and not any(ach.achievement_name == "7_Day_Streak" for ach_list in user.achievements for ach in ach_list.achievements):
        seven_day_streak_achievement = achievementsData(
            achievement_name="7_Day_Streak",
            description="You maintained a login streak for 7 consecutive days!"
        )
        if not user.achievements:
            user.achievements = [Achievements(achievements=[])]
        user.achievements[0].achievements.append(seven_day_streak_achievement)
        return True
    return False

# You can add more achievement checking functions here in the future