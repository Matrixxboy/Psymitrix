from datetime import datetime, timedelta
from typing import Dict, Any
from Database.db_connection import get_mongo_db
from models.admin_model import Admin
from fastapi import HTTPException
import statistics

async def get_user_analytics(db, date_range_days: int = 30) -> Dict[str, Any]:
    """Get comprehensive user analytics"""
    try:
        users_collection = db["users"]
        
        # Date range for recent activities
        date_range_start = datetime.utcnow() - timedelta(days=date_range_days)
        
        # Total users
        total_users = users_collection.count_documents({})
        
        # Active users (logged in within last 30 days)
        active_users = users_collection.count_documents({
            "last_login": {"$gte": date_range_start}
        })
        
        # New users (created in last 30 days)
        new_users = users_collection.count_documents({
            "created_at": {"$gte": date_range_start}
        })
        
        # Users with verified emails
        verified_users = users_collection.count_documents({
            "is_verified": True
        })
        
        # Get user engagement metrics
        total_sessions = 0
        total_assessments = 0
        total_mood_entries = 0
        avg_session_length = 0
        
        users = users_collection.find({}, {
            "sessions": 1,
            "mental_health_profile.assessment_results": 1,
            "mood_trends": 1,
            "last_login": 1,
            "created_at": 1
        })
        
        session_lengths = []
        for user in users:
            sessions = user.get("sessions", [])
            total_sessions += len(sessions)
            
            assessments = user.get("mental_health_profile", {}).get("assessment_results", [])
            total_assessments += len(assessments)
            
            mood_trends = user.get("mood_trends", [])
            total_mood_entries += len(mood_trends)
        
        # Calculate averages
        avg_sessions_per_user = total_sessions / max(total_users, 1)
        avg_assessments_per_user = total_assessments / max(total_users, 1)
        avg_mood_entries_per_user = total_mood_entries / max(total_users, 1)
        
        # User retention
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        users_created_30_days_ago = users_collection.count_documents({
            "created_at": {"$gte": thirty_days_ago - timedelta(days=30), "$lt": thirty_days_ago}
        })
        
        users_retained = users_collection.count_documents({
            "created_at": {"$gte": thirty_days_ago - timedelta(days=30), "$lt": thirty_days_ago},
            "last_login": {"$gte": thirty_days_ago}
        })
        
        retention_rate = (users_retained / max(users_created_30_days_ago, 1)) * 100 if users_created_30_days_ago > 0 else 0
        
        # Daily active users trend
        daily_active_users = {}
        for day in range(date_range_days):
            date = (datetime.utcnow() - timedelta(days=day)).date()
            date_start = datetime.combine(date, datetime.min.time())
            date_end = datetime.combine(date, datetime.max.time())
            
            count = users_collection.count_documents({
                "last_login": {"$gte": date_start, "$lte": date_end}
            })
            daily_active_users[str(date)] = count
        
        return {
            "summary": {
                "total_users": total_users,
                "active_users_30_days": active_users,
                "new_users_30_days": new_users,
                "verified_users": verified_users,
                "active_percentage": round((active_users / max(total_users, 1)) * 100, 2),
            },
            "engagement": {
                "total_sessions": total_sessions,
                "total_assessments": total_assessments,
                "total_mood_entries": total_mood_entries,
                "avg_sessions_per_user": round(avg_sessions_per_user, 2),
                "avg_assessments_per_user": round(avg_assessments_per_user, 2),
                "avg_mood_entries_per_user": round(avg_mood_entries_per_user, 2),
            },
            "retention": {
                "retention_rate_30_days": round(retention_rate, 2),
                "users_retained_from_30_days_ago": users_retained,
                "users_created_30_days_ago": users_created_30_days_ago,
            },
            "daily_trends": daily_active_users
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_assessment_analytics(db, assessment_type: str = None, date_range_days: int = 30) -> Dict[str, Any]:
    """Get assessment completion analytics"""
    try:
        users_collection = db["users"]
        date_range_start = datetime.utcnow() - timedelta(days=date_range_days)
        
        # Aggregate assessment data
        pipeline = [
            {"$unwind": "$mental_health_profile.assessment_results"},
            {"$match": {
                "mental_health_profile.assessment_results.date": {"$gte": date_range_start}
            }},
            {"$group": {
                "_id": "$mental_health_profile.assessment_results.assessment_type",
                "count": {"$sum": 1},
                "avg_score": {"$avg": "$mental_health_profile.assessment_results.score"},
                "assessments": {"$push": "$mental_health_profile.assessment_results"}
            }}
        ]
        
        results = list(users_collection.aggregate(pipeline))
        
        # Format results
        assessments = {}
        for result in results:
            assessment_name = result["_id"]
            assessments[assessment_name] = {
                "total_completed": result["count"],
                "average_score": round(result["avg_score"], 2),
                "severity_breakdown": await get_severity_breakdown(result["assessments"])
            }
        
        return {
            "date_range_days": date_range_days,
            "assessments": assessments,
            "total_assessments": sum(a["total_completed"] for a in assessments.values())
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_severity_breakdown(assessments: list) -> Dict[str, int]:
    """Count assessments by severity level"""
    breakdown = {}
    for assessment in assessments:
        severity = assessment.get("severity_level", "unknown")
        breakdown[severity] = breakdown.get(severity, 0) + 1
    return breakdown

async def get_mood_analytics(db, date_range_days: int = 30) -> Dict[str, Any]:
    """Get mood tracking analytics"""
    try:
        users_collection = db["users"]
        date_range_start = datetime.utcnow() - timedelta(days=date_range_days)
        
        # Aggregate mood data
        pipeline = [
            {"$unwind": "$mood_trends"},
            {"$match": {
                "mood_trends.created_at": {"$gte": date_range_start}
            }},
            {"$group": {
                "_id": "$mood_trends.mood",
                "count": {"$sum": 1}
            }}
        ]
        
        results = list(users_collection.aggregate(pipeline))
        
        # Format mood distribution
        mood_distribution = {}
        total_moods = 0
        for result in results:
            mood = result["_id"]
            count = result["count"]
            mood_distribution[mood] = count
            total_moods += count
        
        # Calculate mood percentages
        mood_percentages = {
            mood: round((count / total_moods) * 100, 2) if total_moods > 0 else 0
            for mood, count in mood_distribution.items()
        }
        
        return {
            "date_range_days": date_range_days,
            "total_mood_entries": total_moods,
            "mood_distribution": mood_distribution,
            "mood_percentages": mood_percentages
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_wellness_analytics(db, date_range_days: int = 30) -> Dict[str, Any]:
    """Get wellness metrics analytics"""
    try:
        users_collection = db["users"]
        date_range_start = datetime.utcnow() - timedelta(days=date_range_days)
        
        # Aggregate wellness metrics
        pipeline = [
            {"$unwind": "$mental_health_profile.wellness_metrics"},
            {"$match": {
                "mental_health_profile.wellness_metrics.date": {"$gte": date_range_start}
            }},
            {"$group": {
                "_id": None,
                "avg_sleep_hours": {"$avg": "$mental_health_profile.wellness_metrics.sleep_hours"},
                "avg_activity_minutes": {"$avg": "$mental_health_profile.wellness_metrics.activity_minutes"},
                "avg_stress_level": {"$avg": "$mental_health_profile.wellness_metrics.stress_level"},
                "avg_wellness_score": {"$avg": "$mental_health_profile.wellness_metrics.daily_wellness_score"},
                "count": {"$sum": 1}
            }}
        ]
        
        results = list(users_collection.aggregate(pipeline))
        
        if not results:
            return {
                "date_range_days": date_range_days,
                "total_entries": 0,
                "averages": {
                    "sleep_hours": 0,
                    "activity_minutes": 0,
                    "stress_level": 0,
                    "wellness_score": 0
                }
            }
        
        result = results[0]
        return {
            "date_range_days": date_range_days,
            "total_entries": result.get("count", 0),
            "averages": {
                "sleep_hours": round(result.get("avg_sleep_hours") or 0, 2),
                "activity_minutes": round(result.get("avg_activity_minutes") or 0, 2),
                "stress_level": round(result.get("avg_stress_level") or 0, 2),
                "wellness_score": round(result.get("avg_wellness_score") or 0, 2)
            },
            "goals": {
                "sleep_target": "7-9 hours",
                "activity_target": "30+ minutes",
                "stress_target": "≤3 (out of 10)",
                "wellness_target": "75-100"
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
