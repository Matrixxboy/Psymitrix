from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from models.user_model import User, AssessmentResult
from apis.auth.authentication import get_current_user
from Database.db_connection import get_mongo_db
import json

router = APIRouter(prefix="/assessments", tags=["Assessments"])

# PHQ-9 Questions and scoring
PHQ9_QUESTIONS = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself or that you are a failure",
    "Trouble concentrating on things like reading or watching TV",
    "Moving or speaking so slowly that others could have noticed, or being so fidgety that you've been moving around a lot more than usual",
    "Thoughts that you would be better off dead or hurting yourself"
]

# GAD-7 Questions and scoring
GAD7_QUESTIONS = [
    "Feeling nervous, anxious or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it's hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid as if something awful might happen"
]

class AssessmentQuestion(BaseModel):
    question_id: int
    question_text: str
    score: int = Field(..., ge=0, le=3)  # 0-3 for PHQ-9, 0-3 for GAD-7

class AssessmentSubmission(BaseModel):
    assessment_type: str  # "PHQ-9" or "GAD-7"
    responses: List[AssessmentQuestion]

class AssessmentResultResponse(BaseModel):
    assessment_type: str
    total_score: int
    severity_level: str
    interpretation: str
    recommendations: List[str]
    date: str

def interpret_phq9(score: int) -> tuple:
    """Interpret PHQ-9 score and return severity level and interpretation"""
    if score == 0:
        return "none", "No depression symptoms"
    elif score <= 4:
        return "minimal", "Minimal depressive symptoms"
    elif score <= 9:
        return "mild", "Mild depressive symptoms. Consider self-care and monitor symptoms."
    elif score <= 14:
        return "moderate", "Moderate depressive symptoms. Consider seeking professional help."
    elif score <= 19:
        return "moderately_severe", "Moderately severe depressive symptoms. Professional help recommended."
    else:
        return "severe", "Severe depressive symptoms. Immediate professional help recommended."

def interpret_gad7(score: int) -> tuple:
    """Interpret GAD-7 score and return severity level and interpretation"""
    if score == 0:
        return "none", "No anxiety symptoms"
    elif score <= 4:
        return "minimal", "Minimal anxiety symptoms"
    elif score <= 9:
        return "mild", "Mild anxiety symptoms. Consider relaxation techniques and self-care."
    elif score <= 14:
        return "moderate", "Moderate anxiety symptoms. Professional support recommended."
    elif score <= 20:
        return "moderately_severe", "Moderately severe anxiety symptoms. Seek professional help."
    else:
        return "severe", "Severe anxiety symptoms. Immediate professional intervention needed."

def get_phq9_recommendations(score: int) -> List[str]:
    """Get personalized recommendations based on PHQ-9 score"""
    recommendations = []
    
    if score >= 5:
        recommendations.append("Consider speaking with a mental health professional")
        recommendations.append("Engage in regular physical exercise")
        recommendations.append("Maintain a consistent sleep schedule")
        recommendations.append("Practice daily relaxation or meditation")
        recommendations.append("Reach out to friends or family for support")
    
    if score >= 10:
        recommendations.append("Seek cognitive behavioral therapy (CBT)")
        recommendations.append("Consider consulting a psychiatrist about medication options")
        recommendations.append("Keep a mood journal to track patterns")
    
    if score >= 15:
        recommendations.append("Crisis support available: 988 Suicide & Crisis Lifeline")
        recommendations.append("Consider hospitalization if having thoughts of self-harm")
    
    if not recommendations:
        recommendations.append("Maintain current healthy lifestyle practices")
        recommendations.append("Continue regular check-ins on your mental health")
    
    return recommendations

def get_gad7_recommendations(score: int) -> List[str]:
    """Get personalized recommendations based on GAD-7 score"""
    recommendations = []
    
    if score >= 5:
        recommendations.append("Practice deep breathing exercises (4-7-8 technique)")
        recommendations.append("Reduce caffeine intake")
        recommendations.append("Establish a regular exercise routine")
        recommendations.append("Try mindfulness or meditation apps (Calm, Headspace)")
    
    if score >= 10:
        recommendations.append("Consider cognitive behavioral therapy (CBT) for anxiety")
        recommendations.append("Consult a therapist or counselor")
        recommendations.append("Keep a worry log to identify patterns")
    
    if score >= 15:
        recommendations.append("Seek professional psychiatric evaluation")
        recommendations.append("Consider anxiety management medication")
    
    if not recommendations:
        recommendations.append("Continue healthy stress management practices")
        recommendations.append("Regular exercise and good sleep hygiene are key")
    
    return recommendations

@router.get("/phq9/questions")
async def get_phq9_questions():
    """Get PHQ-9 assessment questions"""
    questions = [
        {"question_id": i, "question_text": q}
        for i, q in enumerate(PHQ9_QUESTIONS)
    ]
    return {
        "status_code": 200,
        "code": "OK",
        "message": "PHQ-9 questions retrieved",
        "data": {
            "assessment_type": "PHQ-9",
            "description": "Patient Health Questionnaire (PHQ-9) for Depression",
            "instructions": "Over the last 2 weeks, how often have you been bothered by any of the following problems? (0=Not at all, 1=Several days, 2=More than half the days, 3=Nearly every day)",
            "questions": questions
        }
    }

@router.get("/gad7/questions")
async def get_gad7_questions():
    """Get GAD-7 assessment questions"""
    questions = [
        {"question_id": i, "question_text": q}
        for i, q in enumerate(GAD7_QUESTIONS)
    ]
    return {
        "status_code": 200,
        "code": "OK",
        "message": "GAD-7 questions retrieved",
        "data": {
            "assessment_type": "GAD-7",
            "description": "Generalized Anxiety Disorder (GAD-7) Assessment",
            "instructions": "Over the last 2 weeks, how often have you been bothered by any of the following problems? (0=Not at all, 1=Several days, 2=More than half the days, 3=Nearly every day)",
            "questions": questions
        }
    }

@router.post("/submit", response_model=AssessmentResultResponse)
async def submit_assessment(
    submission: AssessmentSubmission,
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    """
    Submit assessment responses and calculate score
    """
    try:
        # Calculate total score
        total_score = sum(q.score for q in submission.responses)
        
        # Validate response count
        expected_count = 9 if submission.assessment_type == "PHQ-9" else 7
        if len(submission.responses) != expected_count:
            raise HTTPException(
                status_code=400,
                detail=f"Expected {expected_count} responses, got {len(submission.responses)}"
            )
        
        # Interpret score
        if submission.assessment_type == "PHQ-9":
            severity_level, interpretation = interpret_phq9(total_score)
            recommendations = get_phq9_recommendations(total_score)
        elif submission.assessment_type == "GAD-7":
            severity_level, interpretation = interpret_gad7(total_score)
            recommendations = get_gad7_recommendations(total_score)
        else:
            raise HTTPException(status_code=400, detail="Invalid assessment type")
        
        # Create assessment result
        assessment_result = AssessmentResult(
            assessment_type=submission.assessment_type,
            score=total_score,
            severity_level=severity_level,
            date=datetime.utcnow()
        )
        
        # Update user's assessment results
        current_user.mental_health_profile.assessment_results.append(assessment_result)
        current_user.mental_health_profile.last_assessment_date = datetime.utcnow()
        current_user.updated_at = datetime.utcnow()
        
        # Save to database
        db.users.update_one(
            {"email": current_user.email},
            {
                "$set": {
                    "mental_health_profile": json.loads(
                        current_user.mental_health_profile.model_dump_json()
                    ),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return AssessmentResultResponse(
            assessment_type=submission.assessment_type,
            total_score=total_score,
            severity_level=severity_level,
            interpretation=interpretation,
            recommendations=recommendations,
            date=datetime.utcnow().isoformat()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/results")
async def get_assessment_results(
    assessment_type: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """
    Get assessment history for current user
    """
    try:
        results = []
        for assessment in current_user.mental_health_profile.assessment_results:
            if assessment_type and assessment.assessment_type != assessment_type:
                continue
            
            severity_level, interpretation = (
                interpret_phq9(assessment.score)
                if assessment.assessment_type == "PHQ-9"
                else interpret_gad7(assessment.score)
            )
            
            results.append({
                "assessment_type": assessment.assessment_type,
                "score": assessment.score,
                "severity_level": severity_level,
                "interpretation": interpretation,
                "date": assessment.date.isoformat()
            })
        
        return {
            "status_code": 200,
            "code": "OK",
            "message": "Assessment results retrieved",
            "data": {
                "results": sorted(results, key=lambda x: x["date"], reverse=True)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
