from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from models.user_model import User, Mood
from apis.auth.authentication import get_current_user
from Database.db_connection import get_mongo_db
import statistics

router = APIRouter(prefix="/ai_analytics", tags=["AI Analytics"])

class MoodTrendData(BaseModel):
    date: str
    mood: str
    mood_score: int
    timestamp: str

class MoodAnalysis(BaseModel):
    average_mood_score: float
    mood_trend: str
    dominant_mood: str
    mood_volatility: float
    trend_data: List[MoodTrendData]

class WellnessMetricsAnalysis(BaseModel):
    average_wellness_score: Optional[float] = None
    average_sleep: Optional[float] = None
    average_activity: Optional[int] = None
    average_stress: Optional[float] = None
    insights: List[str]

class AssessmentAnalysis(BaseModel):
    latest_phq9_score: Optional[int] = None
    latest_gad7_score: Optional[int] = None
    phq9_trend: str
    gad7_trend: str
    recommendations: List[str]

class AIInsights(BaseModel):
    period: str
    generated_at: str
    mood_analysis: MoodAnalysis
    wellness_analysis: WellnessMetricsAnalysis
    assessment_analysis: AssessmentAnalysis
    overall_insights: List[str]
    suggested_actions: List[str]

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

def filter_data_by_timeframe(data: List[Any], timeframe: str) -> List[Any]:
    """Filter data by timeframe (week, month, year)"""
    if not data:
        return []
    
    now = datetime.utcnow()
    if timeframe == "week":
        cutoff = now - timedelta(days=7)
    elif timeframe == "month":
        cutoff = now - timedelta(days=30)
    elif timeframe == "year":
        cutoff = now - timedelta(days=365)
    else:
        cutoff = now - timedelta(days=30)
    
    filtered = []
    for item in data:
        try:
            item_date = getattr(item, 'created_at', getattr(item, 'date', None))
            if isinstance(item, dict):
                item_date = item.get('created_at') or item.get('date')

            if not item_date:
                continue

            if isinstance(item_date, str):
                item_date = datetime.fromisoformat(item_date.replace('Z', '+00:00'))

            if item_date.tzinfo:
                item_date = item_date.replace(tzinfo=None)

            if item_date >= cutoff:
                filtered.append(item)
        except (ValueError, TypeError, AttributeError):
            continue
    
    return filtered

def analyze_mood_trends(mood_trends: List, timeframe: str = "month") -> MoodAnalysis:
    """Analyze mood trends over timeframe"""
    filtered_moods = filter_data_by_timeframe(mood_trends, timeframe)
    
    if not filtered_moods:
        return MoodAnalysis(
            average_mood_score=5,
            mood_trend="No data available",
            dominant_mood="neutral",
            mood_volatility=0,
            trend_data=[]
        )
    
    mood_scores = [get_mood_score(m.mood) for m in filtered_moods]
    trend_data = [
        MoodTrendData(
            date=m.created_at.strftime("%Y-%m-%d") if hasattr(m.created_at, 'strftime') else str(m.created_at),
            mood=m.mood,
            mood_score=get_mood_score(m.mood),
            timestamp=m.created_at.isoformat() if hasattr(m.created_at, 'isoformat') else str(m.created_at)
        )
        for m in filtered_moods
    ]
    
    avg_score = statistics.mean(mood_scores)
    volatility = statistics.stdev(mood_scores) if len(mood_scores) > 1 else 0
    
    # Determine trend
    trend = "Insufficient data"
    if len(mood_scores) >= 2:
        if len(mood_scores) >= 4:
            half = len(mood_scores) // 2
            older_avg = statistics.mean(mood_scores[:half])
            recent_avg = statistics.mean(mood_scores[half:])
        else:
            older_avg = mood_scores[0]
            recent_avg = statistics.mean(mood_scores[1:])

        if recent_avg > older_avg + 1:
            trend = "Improving"
        elif recent_avg < older_avg - 1:
            trend = "Declining"
        else:
            trend = "Stable"
    
    # Determine dominant mood
    mood_counts = {}
    for m in filtered_moods:
        mood_counts[m.mood] = mood_counts.get(m.mood, 0) + 1
    dominant_mood = max(mood_counts.keys(), key=lambda k: mood_counts[k]) if mood_counts else "neutral"
    
    return MoodAnalysis(
        average_mood_score=round(avg_score, 2),
        mood_trend=trend,
        dominant_mood=dominant_mood,
        mood_volatility=round(volatility, 2),
        trend_data=trend_data
    )

def analyze_wellness_metrics(user: User, timeframe: str = "month") -> WellnessMetricsAnalysis:
    """Analyze wellness metrics"""
    wellness_metrics = user.mental_health_profile.wellness_metrics
    filtered_metrics = filter_data_by_timeframe(wellness_metrics, timeframe)
    
    insights = []
    
    if not filtered_metrics:
        insights.append("No wellness data available. Start tracking your wellness metrics to get personalized insights.")
        return WellnessMetricsAnalysis(insights=insights)
    
    sleep_hours = [m.sleep_hours for m in filtered_metrics if m.sleep_hours]
    activity_mins = [m.activity_minutes for m in filtered_metrics if m.activity_minutes]
    stress_levels = [m.stress_level for m in filtered_metrics if m.stress_level]
    wellness_scores = [m.daily_wellness_score for m in filtered_metrics if m.daily_wellness_score]
    
    avg_sleep = statistics.mean(sleep_hours) if sleep_hours else None
    avg_activity = statistics.mean(activity_mins) if activity_mins else None
    avg_stress = statistics.mean(stress_levels) if stress_levels else None
    avg_wellness = statistics.mean(wellness_scores) if wellness_scores else None
    
    if avg_sleep:
        if avg_sleep < 6:
            insights.append("Your sleep duration is lower than recommended. Aim for 7-9 hours per night.")
        elif avg_sleep > 9:
            insights.append("You're getting more sleep than typical. Ensure it's quality rest.")
        else:
            insights.append("Your sleep duration is within healthy range.")
    
    if avg_activity:
        if avg_activity < 30:
            insights.append("Increase physical activity to at least 30 minutes daily for better mental health.")
        else:
            insights.append("Great job maintaining consistent physical activity!")
    
    if avg_stress:
        if avg_stress > 7:
            insights.append("Your stress levels are elevated. Consider stress-management techniques like meditation or breathing exercises.")
        elif avg_stress < 4:
            insights.append("You're managing stress well. Keep up your current practices.")
    
    if avg_wellness:
        if avg_wellness > 75:
            insights.append("Excellent overall wellness! You're thriving.")
        elif avg_wellness > 50:
            insights.append("Your wellness is moderate. Focus on one area for improvement.")
        else:
            insights.append("Your wellness needs attention. Consider scheduling sessions with our AI psychiatrist.")
    
    return WellnessMetricsAnalysis(
        average_wellness_score=round(avg_wellness, 2) if avg_wellness else None,
        average_sleep=round(avg_sleep, 2) if avg_sleep else None,
        average_activity=round(avg_activity) if avg_activity else None,
        average_stress=round(avg_stress, 2) if avg_stress else None,
        insights=insights if insights else ["Keep tracking your wellness metrics for better insights."]
    )

def analyze_assessments(user: User, timeframe: str = "month") -> AssessmentAnalysis:
    """Analyze assessment results"""
    assessment_results = user.mental_health_profile.assessment_results
    filtered_assessments = filter_data_by_timeframe(assessment_results, timeframe)
    
    phq9_results = [a for a in filtered_assessments if a.assessment_type == "PHQ-9"]
    gad7_results = [a for a in filtered_assessments if a.assessment_type == "GAD-7"]
    
    latest_phq9 = phq9_results[-1].score if phq9_results else None
    latest_gad7 = gad7_results[-1].score if gad7_results else None
    
    recommendations = []
    
    # PHQ-9 analysis
    phq9_trend = "No data"
    if len(phq9_results) >= 2:
        if phq9_results[-1].score < phq9_results[0].score:
            phq9_trend = "Improving"
        elif phq9_results[-1].score > phq9_results[0].score:
            phq9_trend = "Worsening"
        else:
            phq9_trend = "Stable"
    
    if latest_phq9:
        if latest_phq9 >= 20:
            recommendations.append("Your depression score is high. Consider more frequent AI chat sessions and consult with a professional.")
        elif latest_phq9 >= 10:
            recommendations.append("Moderate depression symptoms detected. Daily practice of coping skills is recommended.")
        else:
            recommendations.append("Your depression screening shows minimal symptoms.")
    
    # GAD-7 analysis
    gad7_trend = "No data"
    if len(gad7_results) >= 2:
        if gad7_results[-1].score < gad7_results[0].score:
            gad7_trend = "Improving"
        elif gad7_results[-1].score > gad7_results[0].score:
            gad7_trend = "Worsening"
        else:
            gad7_trend = "Stable"
    
    if latest_gad7:
        if latest_gad7 >= 15:
            recommendations.append("Your anxiety score is elevated. Practice relaxation techniques and guided meditation.")
        elif latest_gad7 >= 10:
            recommendations.append("Mild anxiety detected. Regular breathing exercises may help.")
        else:
            recommendations.append("Your anxiety screening shows minimal symptoms.")
    
    if not recommendations:
        recommendations.append("Keep up regular assessments to track your mental health progress.")
    
    return AssessmentAnalysis(
        latest_phq9_score=latest_phq9,
        latest_gad7_score=latest_gad7,
        phq9_trend=phq9_trend,
        gad7_trend=gad7_trend,
        recommendations=recommendations
    )

@router.get("/insights", response_model=AIInsights)
async def get_ai_insights(
    timeframe: str = Query("month", regex="^(week|month|year)$"),
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    """
    Get comprehensive AI-driven insights based on user data
    Timeframe: week, month, or year
    """
    try:
        mood_analysis = analyze_mood_trends(current_user.mood_trends, timeframe)
        wellness_analysis = analyze_wellness_metrics(current_user, timeframe)
        assessment_analysis = analyze_assessments(current_user, timeframe)
        
        overall_insights = []
        
        if mood_analysis.mood_trend == "Improving":
            overall_insights.append("You're on an upward trajectory in your mental wellness!")
        elif mood_analysis.mood_trend == "Declining":
            overall_insights.append("We notice a decline in your mood. Would you like to talk to our AI psychiatrist?")
        else:
            overall_insights.append("Your mood has remained consistent recently.")
        
        if mood_analysis.mood_volatility > 3:
            overall_insights.append("Your mood fluctuates notably. This could indicate sensitivity to external factors.")
        
        overall_insights.extend(wellness_analysis.insights[:2])
        
        suggested_actions = [
            f"Continue your {mood_analysis.dominant_mood} mood patterns by doing activities you enjoy",
            "Complete a weekly assessment to track your mental health trajectory",
            "Try one new wellness activity this week",
            "Schedule a chat session with Shvayam to discuss your recent experiences"
        ]
        
        return AIInsights(
            period=timeframe,
            generated_at=datetime.utcnow().isoformat(),
            mood_analysis=mood_analysis,
            wellness_analysis=wellness_analysis,
            assessment_analysis=assessment_analysis,
            overall_insights=overall_insights,
            suggested_actions=suggested_actions
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate insights: {str(e)}")

@router.get("/mood-trends")
async def get_mood_trends_with_timeframe(
    timeframe: str = Query("month", regex="^(week|month|year)$"),
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    """
    Get mood trends for specified timeframe with visualization data
    """
    try:
        filtered_moods = filter_data_by_timeframe(current_user.mood_trends, timeframe)
        
        mood_data = []
        for mood in filtered_moods:
            mood_data.append({
                "date": mood.created_at.strftime("%Y-%m-%d") if hasattr(mood.created_at, 'strftime') else str(mood.created_at),
                "mood": mood.mood,
                "score": get_mood_score(mood.mood),
                "timestamp": mood.created_at.isoformat() if hasattr(mood.created_at, 'isoformat') else str(mood.created_at)
            })
        
        return {
            "status_code": 200,
            "code": "OK",
            "message": "Mood trends retrieved successfully",
            "data": {
                "timeframe": timeframe,
                "count": len(mood_data),
                "moods": mood_data
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/wellness-summary")
async def get_wellness_summary(
    timeframe: str = Query("month", regex="^(week|month|year)$"),
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    """
    Get wellness metrics summary for specified timeframe
    """
    try:
        wellness_analysis = analyze_wellness_metrics(current_user, timeframe)
        
        return {
            "status_code": 200,
            "code": "OK",
            "message": "Wellness summary retrieved successfully",
            "data": wellness_analysis.dict()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
