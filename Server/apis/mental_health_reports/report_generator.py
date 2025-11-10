from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Table, TableStyle, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from datetime import datetime, timedelta
import tempfile
import os
from typing import Optional, Dict, Any, List
import statistics

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

def calculate_mental_health_analysis(user: Any) -> Dict[str, Any]:
    """Calculate comprehensive mental health analysis"""
    
    # Get latest mood
    latest_mood = user.mood_trends[-1].mood if user.mood_trends else "Not tracked"
    
    # Get assessment scores
    latest_phq9 = None
    latest_gad7 = None
    phq9_history = []
    gad7_history = []
    
    for result in user.mental_health_profile.assessment_results:
        if result.assessment_type == "PHQ-9":
            phq9_history.append(result)
            latest_phq9 = result
        elif result.assessment_type == "GAD-7":
            gad7_history.append(result)
            latest_gad7 = result
    
    # Calculate mood trends
    mood_scores = [get_mood_score(m.mood) for m in user.mood_trends[-30:]] if user.mood_trends else []
    avg_mood = statistics.mean(mood_scores) if mood_scores else 5
    
    # Generate insights
    insights = {
        "profile_summary": {
            "name": user.firstName or user.username,
            "email": user.email,
            "report_date": datetime.utcnow().strftime("%B %d, %Y"),
            "age": user.age,
            "gender": user.gender
        },
        "mood_analysis": {
            "latest_mood": latest_mood,
            "average_mood_score": round(avg_mood, 2),
            "mood_entries_this_month": len([m for m in user.mood_trends if m.created_at >= datetime.utcnow() - timedelta(days=30)]),
            "trend": "Improving" if len(mood_scores) > 1 and statistics.mean(mood_scores[-7:]) > statistics.mean(mood_scores[:7]) else "Stable" if len(mood_scores) <= 1 else "Declining"
        },
        "assessment_scores": {
            "phq9": {
                "latest": latest_phq9.score if latest_phq9 else None,
                "severity": latest_phq9.severity_level if latest_phq9 else None,
                "last_taken": latest_phq9.date.strftime("%B %d, %Y") if latest_phq9 else "Never"
            },
            "gad7": {
                "latest": latest_gad7.score if latest_gad7 else None,
                "severity": latest_gad7.severity_level if latest_gad7 else None,
                "last_taken": latest_gad7.date.strftime("%B %d, %Y") if latest_gad7 else "Never"
            }
        },
        "engagement": {
            "total_sessions": len(user.sessions_chat_history),
            "total_assessments": len(user.mental_health_profile.assessment_results),
            "current_streak": user.streak,
            "longest_streak": user.longest_streak,
            "achievements": len(user.achievements)
        },
        "recommendations": [
            "Schedule regular check-ins with AI psychiatrist for consistent mental health support",
            "Complete assessments monthly to track progress and identify patterns",
            "Practice at least one wellness activity daily from the suggested list",
            "Consider professional consultation if scores increase significantly",
            "Maintain mood tracking for better insights into your emotional patterns"
        ],
        "wellness_metrics": {
            "sleep_hours": None,
            "activity_minutes": None,
            "stress_level": None,
            "daily_wellness_score": None
        }
    }
    
    # Add wellness metrics if available
    if user.mental_health_profile.wellness_metrics:
        latest_metric = user.mental_health_profile.wellness_metrics[-1]
        insights["wellness_metrics"]["sleep_hours"] = latest_metric.sleep_hours
        insights["wellness_metrics"]["activity_minutes"] = latest_metric.activity_minutes
        insights["wellness_metrics"]["stress_level"] = latest_metric.stress_level
        insights["wellness_metrics"]["daily_wellness_score"] = latest_metric.daily_wellness_score
    
    return insights

def generate_mental_health_report(
    user: Any,
    include_assessments: bool = True,
    include_mood_trends: bool = True,
    include_recommendations: bool = True,
    date_range_days: int = 30
) -> str:
    """
    Generate a comprehensive PDF mental health report
    """
    
    # Create PDF file
    temp_dir = tempfile.gettempdir()
    filename = f"mental_health_report_{user.user_id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.pdf"
    filepath = os.path.join(temp_dir, filename)
    
    # Create PDF document
    doc = SimpleDocTemplate(filepath, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=28,
        textColor=colors.HexColor('#A5645A'),
        spaceAfter=6,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#A5645A'),
        spaceAfter=12,
        spaceBefore=12,
        fontName='Helvetica-Bold'
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=11,
        spaceAfter=8,
        alignment=TA_JUSTIFY,
        fontName='Helvetica'
    )
    
    # Get analysis
    analysis = calculate_mental_health_analysis(user)
    
    # Title
    story.append(Paragraph("PsyMitrix Mental Health Report", title_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Report Info
    report_info = f"Report Date: {analysis['profile_summary']['report_date']}"
    story.append(Paragraph(report_info, body_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Executive Summary
    story.append(Paragraph("Executive Summary", heading_style))
    summary_text = f"""
    This comprehensive mental health report provides an overview of your psychological well-being 
    based on data collected through the PsyMitrix platform. The report includes mood tracking, 
    standardized assessment results, engagement metrics, and personalized recommendations for 
    continued wellness.
    <br/><br/>
    <b>Key Findings:</b><br/>
    • Current Mood: {analysis['mood_analysis']['latest_mood']}<br/>
    • Average Mood Score (Last 30 Days): {analysis['mood_analysis']['average_mood_score']}/10<br/>
    • Mood Trend: {analysis['mood_analysis']['trend']}<br/>
    • Current Streak: {analysis['engagement']['current_streak']} days<br/>
    """
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 0.3*inch))
    
    # Mood Analysis
    if include_mood_trends:
        story.append(Paragraph("Mood Analysis", heading_style))
        
        mood_trends = user.mood_trends[-30:] if user.mood_trends else []
        mood_text = f"""
        You have logged {len(mood_trends)} mood entries in the past 30 days. 
        Your average mood score is {analysis['mood_analysis']['average_mood_score']}/10, 
        indicating a {analysis['mood_analysis']['trend'].lower()} trend.
        <br/><br/>
        <b>Mood Distribution:</b><br/>
        """
        
        if mood_trends:
            mood_counts = {}
            for m in mood_trends:
                mood_counts[m.mood] = mood_counts.get(m.mood, 0) + 1
            
            for mood, count in sorted(mood_counts.items(), key=lambda x: x[1], reverse=True):
                percentage = (count / len(mood_trends)) * 100
                mood_text += f"• {mood.capitalize()}: {count} times ({percentage:.1f}%)<br/>"
        
        story.append(Paragraph(mood_text, body_style))
        story.append(Spacer(1, 0.3*inch))
    
    # Assessment Results
    if include_assessments:
        story.append(Paragraph("Assessment Results", heading_style))
        
        phq9_data = analysis['assessment_scores']['phq9']
        gad7_data = analysis['assessment_scores']['gad7']
        
        assessment_text = f"""
        <b>PHQ-9 (Depression Screening):</b><br/>
        • Latest Score: {phq9_data['latest'] or 'Not yet assessed'}<br/>
        • Severity Level: {phq9_data['severity'] or 'N/A'}<br/>
        • Last Taken: {phq9_data['last_taken']}<br/>
        <br/>
        <b>GAD-7 (Anxiety Screening):</b><br/>
        • Latest Score: {gad7_data['latest'] or 'Not yet assessed'}<br/>
        • Severity Level: {gad7_data['severity'] or 'N/A'}<br/>
        • Last Taken: {gad7_data['last_taken']}<br/>
        """
        
        story.append(Paragraph(assessment_text, body_style))
        story.append(Spacer(1, 0.3*inch))
    
    # Wellness Metrics
    story.append(Paragraph("Wellness Metrics", heading_style))
    
    wellness = analysis['wellness_metrics']
    wellness_text = f"""
    <b>Recent Wellness Data:</b><br/>
    • Sleep Hours: {wellness['sleep_hours'] or 'Not tracked'}<br/>
    • Physical Activity (minutes): {wellness['activity_minutes'] or 'Not tracked'}<br/>
    • Stress Level: {wellness['stress_level'] or 'Not tracked'}<br/>
    • Daily Wellness Score: {wellness['daily_wellness_score'] or 'Not tracked'}<br/>
    """
    story.append(Paragraph(wellness_text, body_style))
    story.append(Spacer(1, 0.3*inch))
    
    # Engagement Summary
    story.append(Paragraph("Your Engagement", heading_style))
    
    engagement = analysis['engagement']
    engagement_text = f"""
    • Total Chat Sessions: {engagement['total_sessions']}<br/>
    • Assessments Completed: {engagement['total_assessments']}<br/>
    • Current Streak: {engagement['current_streak']} days<br/>
    • Longest Streak: {engagement['longest_streak']} days<br/>
    • Achievements Unlocked: {engagement['achievements']}<br/>
    """
    story.append(Paragraph(engagement_text, body_style))
    story.append(Spacer(1, 0.3*inch))
    
    # Recommendations
    if include_recommendations:
        story.append(Paragraph("Personalized Recommendations", heading_style))
        
        recommendations_text = "<b>To continue improving your mental health:</b><br/>"
        for i, rec in enumerate(analysis['recommendations'], 1):
            recommendations_text += f"{i}. {rec}<br/>"
        
        story.append(Paragraph(recommendations_text, body_style))
        story.append(Spacer(1, 0.3*inch))
    
    # Important Information
    story.append(PageBreak())
    story.append(Paragraph("Important Information", heading_style))
    
    important_text = """
    <b>Understanding This Report:</b><br/>
    This report is generated based on self-reported mood data and standardized assessment tools. 
    It is designed to support your mental health journey and track your progress over time.
    <br/><br/>
    <b>Crisis Support:</b><br/>
    If you are experiencing a mental health crisis or having thoughts of self-harm, 
    please contact emergency services or a crisis hotline immediately. 
    This platform is not a substitute for professional mental health care.
    <br/><br/>
    <b>Data Privacy:</b><br/>
    Your mental health information is encrypted and stored securely. 
    This report is confidential and should be treated accordingly. 
    You can share this with healthcare providers to support collaborative care.
    <br/><br/>
    <b>Regular Check-ins:</b><br/>
    We recommend completing assessments monthly and maintaining consistent mood tracking 
    for the most accurate analysis of your mental health trends.
    <br/><br/>
    <b>Disclaimer:</b><br/>
    PsyMitrix AI is designed to support mental health, not replace professional care. 
    Always consult with licensed healthcare providers for diagnosis and treatment plans.
    """
    story.append(Paragraph(important_text, body_style))
    story.append(Spacer(1, 0.3*inch))
    
    # Footer
    story.append(Spacer(1, 0.5*inch))
    footer_text = f"<i>Report generated on {datetime.utcnow().strftime('%B %d, %Y at %H:%M %Z')}</i>"
    story.append(Paragraph(footer_text, ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.grey,
        alignment=TA_CENTER
    )))
    
    # Build PDF
    doc.build(story)
    
    return filepath
