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
    
    # Get user data over the last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    
    # Filter mood trends for the last 30 days
    mood_trends_30_days = [m for m in user.mood_trends if m.created_at >= thirty_days_ago]
    
    # Get latest mood
    latest_mood = mood_trends_30_days[-1].mood if mood_trends_30_days else "Not tracked"
    
    # Get assessment scores
    latest_phq9 = None
    latest_gad7 = None
    
    for result in sorted(user.mental_health_profile.assessment_results, key=lambda x: x.date, reverse=True):
        if result.assessment_type == "PHQ-9" and not latest_phq9:
            latest_phq9 = result
        elif result.assessment_type == "GAD-7" and not latest_gad7:
            latest_gad7 = result
    
    # Calculate mood trends
    mood_scores = [get_mood_score(m.mood) for m in mood_trends_30_days]
    avg_mood = statistics.mean(mood_scores) if mood_scores else 5
    
    # Wellness metrics over the last 30 days
    wellness_metrics_30_days = [
        m for m in user.mental_health_profile.wellness_metrics 
        if m.date >= thirty_days_ago
    ]
    
    # Calculate average wellness metrics
    if wellness_metrics_30_days:
        sleep_hours_data = [m.sleep_hours for m in wellness_metrics_30_days if m.sleep_hours is not None]
        avg_sleep = statistics.mean(sleep_hours_data) if sleep_hours_data else None

        activity_minutes_data = [m.activity_minutes for m in wellness_metrics_30_days if m.activity_minutes is not None]
        avg_activity = statistics.mean(activity_minutes_data) if activity_minutes_data else None

        stress_level_data = [m.stress_level for m in wellness_metrics_30_days if m.stress_level is not None]
        avg_stress = statistics.mean(stress_level_data) if stress_level_data else None

        daily_wellness_score_data = [m.daily_wellness_score for m in wellness_metrics_30_days if m.daily_wellness_score is not None]
        avg_wellness_score = statistics.mean(daily_wellness_score_data) if daily_wellness_score_data else None
    else:
        avg_sleep, avg_activity, avg_stress, avg_wellness_score = None, None, None, None

    # Determine mood trend
    mood_trend = "Stable"
    if len(mood_scores) >= 2:
        half = len(mood_scores) // 2
        if half > 0 and len(mood_scores) - half > 0:
            older_avg = statistics.mean(mood_scores[:half])
            recent_avg = statistics.mean(mood_scores[half:])
            if recent_avg > older_avg:
                mood_trend = "Improving"
            elif recent_avg < older_avg:
                mood_trend = "Declining"

    # Get the most recent wellness metric for "current" values
    latest_wellness_metric = user.mental_health_profile.wellness_metrics[-1] if user.mental_health_profile.wellness_metrics else None

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
            "mood_entries_this_month": len(mood_scores),
            "trend": mood_trend
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
            "current": {
                "sleep_hours": latest_wellness_metric.sleep_hours if latest_wellness_metric else None,
                "activity_minutes": latest_wellness_metric.activity_minutes if latest_wellness_metric else None,
                "stress_level": latest_wellness_metric.stress_level if latest_wellness_metric else None,
                "daily_wellness_score": latest_wellness_metric.daily_wellness_score if latest_wellness_metric else None
            },
            "average_30_days": {
                "sleep_hours": round(avg_sleep, 1) if avg_sleep is not None else None,
                "activity_minutes": round(avg_activity) if avg_activity is not None else None,
                "stress_level": round(avg_stress, 1) if avg_stress is not None else None,
                "daily_wellness_score": round(avg_wellness_score, 1) if avg_wellness_score is not None else None
            }
        }
    }
    
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
    current_wellness = wellness['current']
    avg_wellness = wellness['average_30_days']

    def format_wellness_value(current, avg):
        avg_str = f"(Avg: {avg})" if avg is not None else ""
        return f"{current or 'Not tracked'} {avg_str}"

    wellness_text = f"""
    <b>Recent Wellness Data (Last 30 Days):</b><br/>
    • Sleep Hours: {format_wellness_value(current_wellness['sleep_hours'], avg_wellness['sleep_hours'])}<br/>
    • Physical Activity (minutes): {format_wellness_value(current_wellness['activity_minutes'], avg_wellness['activity_minutes'])}<br/>
    • Stress Level (1-10): {format_wellness_value(current_wellness['stress_level'], avg_wellness['stress_level'])}<br/>
    • Daily Wellness Score (1-100): {format_wellness_value(current_wellness['daily_wellness_score'], avg_wellness['daily_wellness_score'])}<br/>
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
