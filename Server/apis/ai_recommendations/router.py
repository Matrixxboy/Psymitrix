from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from models.user_model import User
from apis.auth.authentication import get_current_user
from Database.db_connection import get_mongo_db

router = APIRouter(prefix="/recommendations", tags=["AI Recommendations"])

class Activity(BaseModel):
    name: str
    description: str
    duration: str
    benefits: List[str]
    difficulty: str  # easy, medium, hard

class MealSuggestion(BaseModel):
    meal_name: str
    description: str
    benefits: List[str]
    preparation_time: str

class MeditationSuggestion(BaseModel):
    type: str
    duration: str
    description: str
    benefits: List[str]

class WellnessRecommendation(BaseModel):
    area: str  # mood, sleep, stress, energy, focus
    priority: str  # high, medium, low
    suggestions: List[str]
    activities: List[Activity]

class DailyWellnessPlan(BaseModel):
    date: str
    morning: List[str]
    afternoon: List[str]
    evening: List[str]
    key_focus: str
    estimated_impact: str

class PersonalizedRecommendations(BaseModel):
    generated_at: str
    user_profile_summary: Dict[str, Any]
    wellness_recommendations: List[WellnessRecommendation]
    suggested_activities: List[Activity]
    meditation_suggestions: List[MeditationSuggestion]
    daily_plan: DailyWellnessPlan
    weekly_goals: List[str]
    resources: List[Dict[str, str]]

def get_mood_score(mood: str) -> int:
    """Convert mood string to numeric score"""
    mood_scores = {
        'excited': 10,
        'happy': 8,
        'calm': 7,
        'neutral': 5,
        'sad': 3,
        'angry': 2
    }
    return mood_scores.get(mood, 5)

def generate_wellness_recommendations(user: User) -> List[WellnessRecommendation]:
    """Generate personalized wellness recommendations"""
    recommendations = []
    
    # Analyze latest mood
    latest_mood = user.mood_trends[-1].mood if user.mood_trends else "neutral"
    latest_mood_score = get_mood_score(latest_mood)
    
    # Get latest assessments
    latest_phq9 = None
    latest_gad7 = None
    
    if user.mental_health_profile.assessment_results:
        for result in reversed(user.mental_health_profile.assessment_results):
            if result.assessment_type == "PHQ-9" and not latest_phq9:
                latest_phq9 = result
            elif result.assessment_type == "GAD-7" and not latest_gad7:
                latest_gad7 = result
    
    # MOOD RECOMMENDATIONS
    if latest_mood_score <= 3:
        recommendations.append(WellnessRecommendation(
            area="mood",
            priority="high",
            suggestions=[
                "You're feeling down. Let's work on lifting your mood gradually.",
                "Small positive actions compound over time - start with one activity you enjoy.",
                "Connect with someone you trust - social support is powerful."
            ],
            activities=[
                Activity(
                    name="Mood Lifting Walk",
                    description="Take a 20-minute walk in nature or your favorite outdoor space",
                    duration="20 minutes",
                    benefits=["Boosts serotonin", "Reduces negative thoughts", "Improves mood"],
                    difficulty="easy"
                ),
                Activity(
                    name="Creative Expression",
                    description="Draw, write, or create without judging - just express yourself",
                    duration="15-30 minutes",
                    benefits=["Emotional release", "Builds confidence", "Shifts perspective"],
                    difficulty="easy"
                ),
                Activity(
                    name="Gratitude Journaling",
                    description="Write 3-5 things you're grateful for, even small ones",
                    duration="10 minutes",
                    benefits=["Shifts focus", "Builds resilience", "Increases positivity"],
                    difficulty="easy"
                )
            ]
        ))
    elif latest_mood_score <= 5:
        recommendations.append(WellnessRecommendation(
            area="mood",
            priority="medium",
            suggestions=[
                "Your mood is neutral. This is a good time to focus on prevention.",
                "Engage in activities that bring you joy and maintain stability.",
                "Build on positive moments to strengthen your mood foundation."
            ],
            activities=[
                Activity(
                    name="Hobby Time",
                    description="Dedicate time to something you enjoy",
                    duration="30-45 minutes",
                    benefits=["Increases happiness", "Builds engagement", "Provides flow"],
                    difficulty="easy"
                ),
                Activity(
                    name="Social Connection",
                    description="Reach out to a friend or family member",
                    duration="30 minutes",
                    benefits=["Strengthens relationships", "Improves mood", "Reduces isolation"],
                    difficulty="medium"
                )
            ]
        ))
    else:
        recommendations.append(WellnessRecommendation(
            area="mood",
            priority="low",
            suggestions=[
                "Great mood! Maintain this positive state by continuing what you're doing.",
                "Notice what activities and situations contribute to your good mood.",
                "Help others when possible - boosting others' moods boosts yours."
            ],
            activities=[
                Activity(
                    name="Acts of Kindness",
                    description="Do something kind for someone else",
                    duration="15-30 minutes",
                    benefits=["Deepens positive mood", "Helps others", "Creates meaning"],
                    difficulty="easy"
                )
            ]
        ))
    
    # STRESS RECOMMENDATIONS
    if latest_phq9 and latest_phq9.score > 15:
        recommendations.append(WellnessRecommendation(
            area="stress",
            priority="high",
            suggestions=[
                "Your stress/anxiety levels indicate need for active management.",
                "Combine breathing exercises with physical activity for best results.",
                "Break tasks into smaller steps to feel less overwhelmed."
            ],
            activities=[
                Activity(
                    name="Breathing Exercise",
                    description="Box breathing: 4 counts in, 4 hold, 4 out, 4 hold. Repeat 5 minutes.",
                    duration="5-10 minutes",
                    benefits=["Activates calm response", "Reduces anxiety", "Improves focus"],
                    difficulty="easy"
                ),
                Activity(
                    name="Progressive Muscle Relaxation",
                    description="Systematically tense and relax muscle groups",
                    duration="15 minutes",
                    benefits=["Releases physical tension", "Reduces anxiety", "Improves sleep"],
                    difficulty="medium"
                )
            ]
        ))
    elif latest_gad7 and latest_gad7.score > 10:
        recommendations.append(WellnessRecommendation(
            area="stress",
            priority="medium",
            suggestions=[
                "Moderate anxiety present. Develop a daily anxiety management routine.",
                "Identify triggers and develop specific coping strategies.",
                "Practice one stress-reduction technique daily for consistency."
            ],
            activities=[
                Activity(
                    name="Guided Meditation",
                    description="Start with 10-minute guided meditation for anxiety",
                    duration="10 minutes",
                    benefits=["Calms nervous system", "Reduces worry", "Improves clarity"],
                    difficulty="easy"
                )
            ]
        ))
    else:
        recommendations.append(WellnessRecommendation(
            area="stress",
            priority="low",
            suggestions=[
                "Your stress levels are well-managed. Continue your current practices.",
                "Maintain preventive stress management as part of your routine."
            ],
            activities=[]
        ))
    
    # SLEEP RECOMMENDATIONS
    latest_wellness_metric = None
    if user.mental_health_profile.wellness_metrics:
        latest_wellness_metric = user.mental_health_profile.wellness_metrics[-1]
    
    if latest_wellness_metric and latest_wellness_metric.sleep_hours and latest_wellness_metric.sleep_hours < 6:
        recommendations.append(WellnessRecommendation(
            area="sleep",
            priority="high",
            suggestions=[
                "Insufficient sleep detected. Prioritize sleep as your #1 health goal.",
                "Establish consistent sleep schedule (same time daily).",
                "Avoid screens 1 hour before bed; create a wind-down routine."
            ],
            activities=[
                Activity(
                    name="Sleep Hygiene Setup",
                    description="Optimize your sleep environment: dark, cool, quiet room",
                    duration="30 minutes",
                    benefits=["Better sleep quality", "Deeper rest", "Improved recovery"],
                    difficulty="easy"
                ),
                Activity(
                    name="Evening Wind Down",
                    description="30-minute routine: stretching, reading, or relaxing music",
                    duration="30 minutes",
                    benefits=["Prepares body for sleep", "Reduces insomnia", "Builds routine"],
                    difficulty="easy"
                )
            ]
        ))
    elif latest_wellness_metric and latest_wellness_metric.sleep_hours and latest_wellness_metric.sleep_hours < 7:
        recommendations.append(WellnessRecommendation(
            area="sleep",
            priority="medium",
            suggestions=[
                "Your sleep is slightly below optimal. Aim for 7-9 hours.",
                "Consistency matters more than quantity - same bedtime helps."
            ],
            activities=[
                Activity(
                    name="Sleep Tracking",
                    description="Start noting sleep patterns to identify improvements",
                    duration="2 minutes nightly",
                    benefits=["Builds awareness", "Identifies patterns", "Motivates improvement"],
                    difficulty="easy"
                )
            ]
        ))
    
    # ACTIVITY RECOMMENDATIONS
    if latest_wellness_metric and latest_wellness_metric.activity_minutes and latest_wellness_metric.activity_minutes < 30:
        recommendations.append(WellnessRecommendation(
            area="energy",
            priority="high",
            suggestions=[
                "Increase physical activity to boost mood and energy.",
                "Start small: even 10 minutes of movement helps.",
                "Find activities you enjoy to make it sustainable."
            ],
            activities=[
                Activity(
                    name="Quick Workout",
                    description="15-minute home workout (no equipment needed)",
                    duration="15 minutes",
                    benefits=["Boosts energy", "Improves mood", "Strengthens body"],
                    difficulty="medium"
                )
            ]
        ))
    
    return recommendations

def generate_meditation_suggestions(user: User) -> List[MeditationSuggestion]:
    """Generate meditation suggestions based on user needs"""
    suggestions = []
    
    latest_mood = user.mood_trends[-1].mood if user.mood_trends else "neutral"
    latest_mood_score = get_mood_score(latest_mood)
    
    if latest_mood_score <= 3:
        suggestions.append(MeditationSuggestion(
            type="Loving Kindness",
            duration="10 minutes",
            description="Cultivate compassion for yourself and others",
            benefits=["Builds self-compassion", "Reduces self-criticism", "Increases kindness"]
        ))
    
    suggestions.extend([
        MeditationSuggestion(
            type="Mindfulness",
            duration="10 minutes",
            description="Observe thoughts and feelings without judgment",
            benefits=["Builds awareness", "Reduces anxiety", "Improves focus"]
        ),
        MeditationSuggestion(
            type="Body Scan",
            duration="15 minutes",
            description="Progressively relax your body from head to toe",
            benefits=["Releases tension", "Improves sleep", "Builds mind-body connection"]
        ),
        MeditationSuggestion(
            type="Breathing Focus",
            duration="5 minutes",
            description="Simple breath awareness meditation",
            benefits=["Calms nervous system", "Reduces anxiety", "Improves clarity"]
        )
    ])
    
    return suggestions

def generate_daily_plan(user: User) -> DailyWellnessPlan:
    """Generate a personalized daily wellness plan"""
    return DailyWellnessPlan(
        date=datetime.utcnow().strftime("%Y-%m-%d"),
        morning=[
            "Morning meditation (5 minutes)",
            "Hydrate: drink 2 glasses of water",
            "Healthy breakfast with protein",
            "Set one intention for the day"
        ],
        afternoon=[
            "Movement break: 10-minute walk or stretch",
            "Healthy lunch with balance of nutrients",
            "One grounding activity: step outside, listen to music",
            "Afternoon check-in: How am I feeling?"
        ],
        evening=[
            "Evening wind-down: 30 minutes screen-free time",
            "Reflective activity: journaling or gratitude",
            "Gentle stretching or yoga",
            "Consistent bedtime routine"
        ],
        key_focus="Balance movement, nutrition, and mental breaks throughout your day",
        estimated_impact="Consistent daily practice compounds into significant wellness improvements over weeks"
    )

@router.get("/personalized", response_model=PersonalizedRecommendations)
async def get_personalized_recommendations(
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    """
    Get comprehensive personalized wellness recommendations
    based on user profile, mood, assessments, and wellness metrics
    """
    try:
        wellness_recommendations = generate_wellness_recommendations(current_user)
        meditation_suggestions = generate_meditation_suggestions(current_user)
        daily_plan = generate_daily_plan(current_user)
        
        # Collect all activities from recommendations
        all_activities = []
        for rec in wellness_recommendations:
            all_activities.extend(rec.activities)
        
        # Generate weekly goals
        weekly_goals = [
            "Complete one assessment (PHQ-9 or GAD-7)",
            "Practice meditation 4+ times",
            "Maintain consistent sleep schedule",
            "Engage in 150 minutes of physical activity",
            "Connect meaningfully with one person",
            "Practice one new coping skill"
        ]
        
        # Resources
        resources = [
            {
                "title": "Mental Health Hotline",
                "description": "24/7 support when needed",
                "type": "crisis"
            },
            {
                "title": "Meditation App",
                "description": "Guided meditations for various needs",
                "type": "tool"
            },
            {
                "title": "Sleep Tracker",
                "description": "Monitor sleep patterns and improvements",
                "type": "tool"
            },
            {
                "title": "Mood Journal",
                "description": "Track emotional patterns",
                "type": "tool"
            }
        ]
        
        # User profile summary
        latest_phq9 = None
        latest_gad7 = None
        if current_user.mental_health_profile.assessment_results:
            for result in reversed(current_user.mental_health_profile.assessment_results):
                if result.assessment_type == "PHQ-9" and not latest_phq9:
                    latest_phq9 = result
                elif result.assessment_type == "GAD-7" and not latest_gad7:
                    latest_gad7 = result
        
        user_profile_summary = {
            "name": current_user.firstName or current_user.username,
            "latest_mood": current_user.mood_trends[-1].mood if current_user.mood_trends else "not tracked",
            "phq9_score": latest_phq9.score if latest_phq9 else "not assessed",
            "gad7_score": latest_gad7.score if latest_gad7 else "not assessed",
            "total_sessions": len(current_user.sessions_chat_history),
            "total_mood_entries": len(current_user.mood_trends),
            "streak": current_user.streak,
            "achievements": len(current_user.achievements)
        }
        
        return PersonalizedRecommendations(
            generated_at=datetime.utcnow().isoformat(),
            user_profile_summary=user_profile_summary,
            wellness_recommendations=wellness_recommendations,
            suggested_activities=all_activities[:5],
            meditation_suggestions=meditation_suggestions,
            daily_plan=daily_plan,
            weekly_goals=weekly_goals,
            resources=resources
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendations: {str(e)}")

@router.get("/quick-suggestions")
async def get_quick_suggestions(
    area: str = Query("all", regex="^(all|mood|stress|sleep|energy|focus)$"),
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    """
    Get quick suggestions for a specific wellness area
    """
    try:
        all_recommendations = generate_wellness_recommendations(current_user)
        
        if area == "all":
            suggestions = []
            for rec in all_recommendations:
                suggestions.extend(rec.suggestions)
        else:
            matching = [r for r in all_recommendations if r.area == area]
            suggestions = []
            for rec in matching:
                suggestions.extend(rec.suggestions)
        
        return {
            "status_code": 200,
            "code": "OK",
            "message": f"Quick suggestions for {area}",
            "data": {
                "area": area,
                "suggestions": suggestions if suggestions else ["No specific recommendations at this time. Keep tracking your wellness!"]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
