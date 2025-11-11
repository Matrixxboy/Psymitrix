from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Table, TableStyle, KeepTogether, RectBg
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas
from datetime import datetime, timedelta
import tempfile
import os
from typing import Optional, Dict, Any, List
import statistics
from reportlab.graphics.shapes import Drawing, Rect, String
from reportlab.graphics.charts.lineplots import LinePlot
from reportlab.graphics.charts.spider import SpiderChart
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.axes import XCategoryAxis, YValueAxis
from reportlab.graphics.widgets.markers import makeMarker
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

def get_mood_score(mood: str) -> int:
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
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    
    mood_trends_30_days = [m for m in user.mood_trends if m.created_at >= thirty_days_ago]
    
    latest_mood = mood_trends_30_days[-1].mood if mood_trends_30_days else "Not tracked"
    
    latest_phq9 = None
    latest_gad7 = None
    
    for result in sorted(user.mental_health_profile.assessment_results, key=lambda x: x.date, reverse=True):
        if result.assessment_type == "PHQ-9" and not latest_phq9:
            latest_phq9 = result
        elif result.assessment_type == "GAD-7" and not latest_gad7:
            latest_gad7 = result
    
    mood_scores = [get_mood_score(m.mood) for m in mood_trends_30_days]
    avg_mood = statistics.mean(mood_scores) if mood_scores else 5
    
    wellness_metrics_30_days = [
        m for m in user.mental_health_profile.wellness_metrics 
        if m.date >= thirty_days_ago
    ]
    
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

    latest_wellness_metric = user.mental_health_profile.wellness_metrics[-1] if user.mental_health_profile.wellness_metrics else None

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

def create_mood_trend_chart(mood_trends_30_days: List[Any]) -> Optional[Drawing]:
    if not mood_trends_30_days or len(mood_trends_30_days) < 2:
        return None

    drawing = Drawing(400, 200)
    
    data = [(i, get_mood_score(m.mood)) for i, m in enumerate(mood_trends_30_days)]
    
    lp = LinePlot()
    lp.x = 50
    lp.y = 50
    lp.height = 125
    lp.width = 300
    lp.data = [data]
    lp.joinedLines = 1
    lp.lines[0].strokeColor = colors.HexColor('#A5645A')
    lp.lines[0].symbol = makeMarker('Circle', size=4)

    lp.xValueAxis = XCategoryAxis()
    lp.xValueAxis.categoryNames = [m.created_at.strftime('%b %d') for m in mood_trends_30_days]
    lp.xValueAxis.labels.boxAnchor = 'n'
    lp.xValueAxis.labels.dx = 0
    lp.xValueAxis.labels.dy = -5
    lp.xValueAxis.labels.angle = 30
    lp.xValueAxis.strokeColor = colors.grey

    lp.yValueAxis = YValueAxis()
    lp.yValueAxis.valueMin = 0
    lp.yValueAxis.valueMax = 10
    lp.yValueAxis.valueStep = 2
    lp.yValueAxis.strokeColor = colors.grey

    drawing.add(lp)
    
    return drawing

def create_wellness_balance_chart(analysis: Dict[str, Any]) -> Drawing:
    drawing = Drawing(200, 200)
    
    wellness_metrics = analysis['wellness_metrics']
    
    avg_stress = wellness_metrics['average_30_days']['stress_level'] or 5
    
    avg_sleep_hours = wellness_metrics['average_30_days']['sleep_hours'] or 0
    sleep_score = max(1, min(10, (avg_sleep_hours / 8) * 10)) if avg_sleep_hours else 5

    mood_score = analysis['mood_analysis']['average_mood_score'] or 5
    
    avg_wellness_score = wellness_metrics['average_30_days']['daily_wellness_score'] or 0
    energy_score = max(1, min(10, (avg_wellness_score / 100) * 10)) if avg_wellness_score else 5
    
    focus_score = (mood_score + energy_score) / 2

    data = [(avg_stress, sleep_score, mood_score, energy_score, focus_score)]

    sc = SpiderChart()
    sc.x = 50
    sc.y = 50
    sc.height = 100
    sc.width = 100
    sc.data = data
    sc.strands[0].strokeColor = colors.HexColor('#6495ED') 
    
    sc.labels = ["Stress (Low is Better)", "Sleep", "Mood", "Energy", "Focus"]
    sc.spokes.strokeColor = colors.lightgrey

    drawing.add(sc)
    return drawing

def create_mood_distribution_chart(mood_trends_30_days: List[Any]) -> Optional[Drawing]:
    if not mood_trends_30_days:
        return None

    mood_counts = {}
    for m in mood_trends_30_days:
        mood_counts[m.mood] = mood_counts.get(m.mood, 0) + 1
        
    data = list(mood_counts.values())
    labels = list(mood_counts.keys())

    drawing = Drawing(300, 150)
    pc = Pie()
    pc.x = 65
    pc.y = 15
    pc.width = 120
    pc.height = 120
    pc.data = data
    pc.labels = labels
    
    mood_colors = {
        'excited': HexColor('#FFD700'), # Gold
        'happy': HexColor('#3CB371'),   # Medium Sea Green
        'calm': HexColor('#4682B4'),    # Steel Blue
        'neutral': HexColor('#A9A9A9'), # Dark Gray
        'sad': HexColor('#B0C4DE'),     # Light Steel Blue
        'angry': HexColor('#DC143C')    # Crimson
    }
    for i, mood in enumerate(labels):
        pc.slices[i].fillColor = mood_colors.get(mood, colors.grey)
        pc.slices[i].popout = 2 

    pc.sideLabels = 1
    pc.sideLabelsOffset = 0.1
    
    drawing.add(pc)
    return drawing

def generate_mental_health_report(
    user: Any,
    include_assessments: bool = True,
    include_mood_trends: bool = True,
    include_recommendations: bool = True,
    date_range_days: int = 30
) -> str:

    temp_dir = tempfile.gettempdir()
    filename = f"mental_health_report_{user.user_id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.pdf"
    filepath = os.path.join(temp_dir, filename)

    doc = SimpleDocTemplate(filepath, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
    styles = getSampleStyleSheet()
    story = []

    # Enhanced color palette with gradients
    COLOR_PRIMARY = HexColor('#8B5A3C')  # Warm brown
    COLOR_ACCENT = HexColor('#4A90E2')   # Professional blue
    COLOR_SUCCESS = HexColor('#27AE60')  # Green for positive metrics
    COLOR_WARNING = HexColor('#F39C12')  # Orange for caution
    COLOR_DANGER = HexColor('#E74C3C')   # Red for concern
    COLOR_BACKGROUND = HexColor('#F8F9FA') # Light background
    COLOR_LIGHT_BLUE = HexColor('#ECF0F1') # Very light blue
    COLOR_DARK_TEXT = HexColor('#2C3E50') # Dark text
    COLOR_SECONDARY = HexColor('#95A5A6') # Gray 

    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=38,
        textColor=COLOR_PRIMARY,
        spaceAfter=5,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        borderColor=COLOR_ACCENT,
        borderWidth=2,
        borderPadding=8,
        borderRadius=6
    )

    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=COLOR_ACCENT,
        spaceAfter=12,
        spaceBefore=16,
        fontName='Helvetica-Bold',
        textColor=COLOR_PRIMARY,
        borderColor=COLOR_ACCENT,
        borderWidth=1,
        borderPadding=6
    )

    sub_heading_style = ParagraphStyle(
        'CustomSubHeading',
        parent=styles['Heading3'],
        fontSize=13,
        textColor=HexColor('#2C3E50'),
        spaceAfter=8,
        spaceBefore=10,
        fontName='Helvetica-Bold',
        borderLeftColor=COLOR_ACCENT,
        borderLeftWidth=3,
        leftIndent=8,
        paddingLeft=5
    )

    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=10,
        spaceAfter=8,
        alignment=TA_JUSTIFY,
        fontName='Helvetica',
        textColor=COLOR_DARK_TEXT,
        leading=14
    )

    instruction_style = ParagraphStyle(
        'InstructionNote',
        parent=body_style,
        fontSize=9,
        textColor=COLOR_SECONDARY,
        leftIndent=15,
        rightIndent=15,
        spaceBefore=6,
        spaceAfter=10,
        fontName='Helvetica-Oblique',
        backColor=COLOR_LIGHT_BLUE,
        borderColor=COLOR_ACCENT,
        borderWidth=0.5,
        borderPadding=8,
        borderRadius=4
    )

    metric_style = ParagraphStyle(
        'MetricValue',
        parent=styles['Normal'],
        fontSize=12,
        textColor=COLOR_ACCENT,
        fontName='Helvetica-Bold'
    )

    analysis = calculate_mental_health_analysis(user)
    
    thirty_days_ago = datetime.utcnow() - timedelta(days=date_range_days)
    mood_trends_30_days = [m for m in user.mood_trends if m.created_at >= thirty_days_ago]

    # --- Cover Page & Header ---
    story.append(Spacer(1, 1*inch))
    story.append(Paragraph("🧠 PSYMITRIX 🧠", title_style))
    story.append(Paragraph("Comprehensive Mental Wellness Report", ParagraphStyle(
        'Subtitle', parent=styles['Normal'], fontSize=16, textColor=COLOR_ACCENT, alignment=TA_CENTER, spaceAfter=15, fontName='Helvetica-Bold'
    )))
    story.append(Spacer(1, 0.4*inch))

    profile_summary = analysis['profile_summary']
    summary_data = [
        ["👤 Report For:", f"{profile_summary['name']} (ID: {str(user.user_id)[:8]}...)"],
        ["📅 Date Generated:", profile_summary['report_date']],
        ["📊 Data Period:", f"Last {date_range_days} Days"],
        ["👥 Age/Gender:", f"{profile_summary['age']} / {profile_summary['gender']}"],
        ["✉️  Email:", profile_summary['email']],
    ]

    table_style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BACKGROUND', (0, 1), (-1, -1), COLOR_LIGHT_BLUE),
        ('GRID', (0, 0), (-1, -1), 1, COLOR_ACCENT),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLOR_LIGHT_BLUE, HexColor('#FFFFFF')]),
    ])

    report_info_table = Table(summary_data, colWidths=[1.5*inch, 4.5*inch])
    report_info_table.setStyle(table_style)
    story.append(report_info_table)
    story.append(Spacer(1, 0.6*inch))

    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=COLOR_DANGER,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        backColor=HexColor('#FDEAEA'),
        borderColor=COLOR_DANGER,
        borderWidth=1,
        borderPadding=6
    )
    story.append(Paragraph("⚠️ Disclaimer: This report is for informational purposes only and is not a substitute for professional diagnosis or treatment. Always consult with a licensed healthcare provider.", disclaimer_style))
    story.append(PageBreak())
    
    # --- How to Read Your Report ---
    story.append(Paragraph("📖 How to Read Your Report", heading_style))
    story.append(Paragraph("""
    This section provides context for interpreting the data and visualizations within this report.
    Understanding the metrics is key to a meaningful mental wellness journey.
    """, body_style))
    story.append(Spacer(1, 0.15*inch))

    story.append(Paragraph("1️⃣ Understanding Mood Scores", sub_heading_style))
    mood_guide_data = [
        ["Score", "Mood", "Indicator"],
        ["10", "Excited", "✅ Excellent energy & enthusiasm"],
        ["8", "Happy", "✅ Positive & content"],
        ["7", "Calm", "✅ Peaceful & relaxed"],
        ["5", "Neutral", "⚪ Balanced state"],
        ["3", "Sad", "⚠️ Down or melancholic"],
        ["2", "Angry", "❌ Irritated or frustrated"],
    ]

    mood_table_style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_ACCENT),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, COLOR_ACCENT),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLOR_LIGHT_BLUE, colors.white]),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
    ])

    mood_table = Table(mood_guide_data, colWidths=[0.8*inch, 1.2*inch, 3*inch])
    mood_table.setStyle(mood_table_style)
    story.append(mood_table)
    story.append(Spacer(1, 0.2*inch))

    story.append(Paragraph("2️⃣ Interpreting Assessment Scores", sub_heading_style))
    story.append(Paragraph("""
    <b>PHQ-9 (Depression)</b> and <b>GAD-7 (Anxiety)</b> are clinically validated assessment tools.
    Higher scores indicate more symptoms. Severity ranges: <b>Minimal (0-4)</b>, <b>Mild (5-9)</b>,
    <b>Moderate (10-14)</b>, <b>Moderately Severe (15-19)</b>, <b>Severe (20+)</b>.
    These are screening tools, not clinical diagnoses—always consult a healthcare provider.
    """, body_style))
    story.append(Spacer(1, 0.15*inch))

    story.append(Paragraph("3️⃣ Wellness Metrics & Targets", sub_heading_style))
    wellness_targets_data = [
        ["Metric", "Target Range", "Current 30-Day Avg"],
        ["Sleep Hours", "7-9 hours/night", f"{analysis['wellness_metrics']['average_30_days']['sleep_hours'] or 'N/A'} hrs"],
        ["Activity", "30+ minutes/day", f"{analysis['wellness_metrics']['average_30_days']['activity_minutes'] or 'N/A'} min"],
        ["Stress Level", "1-3 (out of 10)", f"{analysis['wellness_metrics']['average_30_days']['stress_level'] or 'N/A'}"],
        ["Wellness Score", "75-100%", f"{analysis['wellness_metrics']['average_30_days']['daily_wellness_score'] or 'N/A'}%"],
    ]

    wellness_table = Table(wellness_targets_data, colWidths=[1.5*inch, 2*inch, 2.5*inch])
    wellness_table.setStyle(mood_table_style)
    story.append(wellness_table)
    story.append(Spacer(1, 0.2*inch))
    
    # --- Executive Summary ---
    story.append(Paragraph("📊 Executive Summary", heading_style))

    # Calculate overall wellness indicator
    mood_score = analysis['mood_analysis']['average_mood_score']
    wellness_score = analysis['wellness_metrics']['average_30_days']['daily_wellness_score'] or 0

    if mood_score >= 7 and wellness_score >= 75:
        overall_status = "🟢 Excellent"
        status_color = COLOR_SUCCESS
    elif mood_score >= 5.5 and wellness_score >= 60:
        overall_status = "🟡 Good"
        status_color = COLOR_WARNING
    else:
        overall_status = "🔴 Needs Attention"
        status_color = COLOR_DANGER

    summary_table_data = [
        ["Current Mood", "📈 Trend", "💪 Overall Wellness", "🎯 Engagement Level"],
        [
            analysis['mood_analysis']['latest_mood'].upper(),
            analysis['mood_analysis']['trend'],
            f"{wellness_score:.0f}%",
            f"{analysis['engagement']['total_sessions']} sessions"
        ],
    ]

    summary_table_style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_ACCENT),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('FONTSIZE', (0, 1), (-1, 1), 12),
        ('FONTNAME', (0, 1), (-1, 1), 'Helvetica-Bold'),
        ('ROWBACKGROUNDS', (0, 1), (-1, 1), [COLOR_LIGHT_BLUE]),
        ('GRID', (0, 0), (-1, -1), 1, COLOR_ACCENT),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
    ])

    summary_table = Table(summary_table_data, colWidths=[1.4*inch, 1.4*inch, 1.6*inch, 1.8*inch])
    summary_table.setStyle(summary_table_style)
    story.append(summary_table)
    story.append(Spacer(1, 0.2*inch))

    # Overall Status
    overall_text = f"""
    <b>Overall Mental Wellness Status: </b><font color='{status_color.hexValue() if hasattr(status_color, "hexValue") else "000000"}'><b>{overall_status}</b></font>
    <br/><br/>
    <b>Key Insights:</b><br/>
    • Your average mood score is <b>{mood_score}/10</b>, indicating a <b>{('positive' if mood_score >= 6 else 'concerning')}</b> emotional state.<br/>
    • Your mood trend is <b>{analysis['mood_analysis']['trend']}</b> over the past {date_range_days} days.<br/>
    • You have completed <b>{analysis['engagement']['total_assessments']}</b> mental health assessments.<br/>
    • Your current engagement streak is <b>{analysis['engagement']['current_streak']} days</b> (best: <b>{analysis['engagement']['longest_streak']} days</b>).<br/>
    • You have earned <b>{analysis['engagement']['achievements']} achievements</b> on your wellness journey.
    """
    story.append(Paragraph(overall_text, body_style))
    story.append(Spacer(1, 0.25*inch))
    
    # --- Mood Analysis ---
    if include_mood_trends:
        story.append(Paragraph("Mood Analysis", heading_style))
        story.append(Paragraph("""
        This section illustrates the variance and frequency of your emotional states over the tracking period.
        """, body_style))
        
        # Mood Distribution (Pie Chart)
        dist_chart = create_mood_distribution_chart(mood_trends_30_days)
        if dist_chart:
            story.append(Paragraph("Mood Distribution (Past 30 Days)", sub_heading_style))
            story.append(dist_chart)
            story.append(Paragraph("Instruction: The pie chart shows the percentage breakdown of each mood you logged. A balanced distribution with a majority in the positive categories (Excited, Happy, Calm) is ideal.", instruction_style))
            story.append(Spacer(1, 0.2*inch))

        # Mood Trend (Line Chart)
        mood_chart = create_mood_trend_chart(mood_trends_30_days)
        if mood_chart:
            story.append(Paragraph("Daily Mood Trend (Score 1-10)", sub_heading_style))
            story.append(mood_chart)
            story.append(Paragraph(f"Instruction: The line chart tracks your mood score (1-10) over the past {date_range_days} days. Observe the line's direction: An **Improving** trend suggests consistently higher scores, while a **Declining** trend indicates lower scores in the latter half of the period.", instruction_style))
            story.append(Spacer(1, 0.3*inch))
    
    # --- Assessment Results ---
    if include_assessments:
        story.append(Paragraph("Assessment Results", heading_style))
        story.append(Paragraph("""
        Below are the results of your most recent standardized screenings.
        """, body_style))

        phq9_data = analysis['assessment_scores']['phq9']
        gad7_data = analysis['assessment_scores']['gad7']

        assessment_table_data = [
            ["Assessment", "Latest Score", "Severity Level", "Last Taken"],
            ["PHQ-9 (Depression)", phq9_data['latest'] or 'N/A', phq9_data['severity'] or 'N/A', phq9_data['last_taken']],
            ["GAD-7 (Anxiety)", gad7_data['latest'] or 'N/A', gad7_data['severity'] or 'N/A', gad7_data['last_taken']],
        ]

        assessment_table_style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), COLOR_PRIMARY),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BACKGROUND', (0, 1), (-1, -1), COLOR_BACKGROUND),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ])
        
        assessment_table = Table(assessment_table_data, colWidths=[1.8*inch, 1.2*inch, 1.5*inch, 1.7*inch])
        assessment_table.setStyle(assessment_table_style)
        story.append(assessment_table)
        story.append(Paragraph("Instruction: Consult the score interpretation guide within the PsyMitrix app for detailed severity thresholds. If your severity level is Moderate or Severe, professional advice is strongly recommended.", instruction_style))
        story.append(Spacer(1, 0.3*inch))
    
    # --- Wellness Metrics ---
    story.append(Paragraph("Wellness & Lifestyle Metrics", heading_style))
    story.append(Paragraph("Tracking your habits provides critical context for your mental state.", body_style))
    
    # Wellness Balance Chart (Spider Chart)
    story.append(Paragraph("Wellness Balance Snapshot (30-Day Average)", sub_heading_style))
    wellness_chart = create_wellness_balance_chart(analysis)
    story.append(wellness_chart)
    story.append(Paragraph("Instruction: The spider chart visually compares your Stress (lower is better), Sleep, Mood, Energy, and Focus scores (all on a 1-10 scale). A larger, more balanced shape indicates better overall wellness.", instruction_style))
    story.append(Spacer(1, 0.2*inch))

    wellness = analysis['wellness_metrics']
    current_wellness = wellness['current']
    avg_wellness = wellness['average_30_days']

    def get_wellness_data_row(label, unit, current, avg):
        current_str = f"**{current} {unit}**" if current is not None else "Not tracked"
        avg_str = f"**{avg} {unit}**" if avg is not None else "N/A"
        return [label, current_str, avg_str]

    wellness_table_data = [
        ["Metric", "Most Recent Value", f"30-Day Average"],
        get_wellness_data_row("Sleep Hours", "hrs", current_wellness['sleep_hours'], avg_wellness['sleep_hours']),
        get_wellness_data_row("Activity Minutes", "min", current_wellness['activity_minutes'], avg_wellness['activity_minutes']),
        get_wellness_data_row("Stress Level (1-10)", "score", current_wellness['stress_level'], avg_wellness['stress_level']),
        get_wellness_data_row("Daily Wellness Score (1-100)", "score", current_wellness['daily_wellness_score'], avg_wellness['daily_wellness_score']),
    ]

    wellness_table_style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_ACCENT),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BACKGROUND', (0, 1), (-1, -1), COLOR_BACKGROUND),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ('TEXTCOLOR', (1, 1), (2, -1), colors.darkslategray),
    ])

    wellness_table = Table(wellness_table_data, colWidths=[2.2*inch, 2*inch, 2*inch])
    wellness_table.setStyle(wellness_table_style)
    story.append(wellness_table)
    story.append(Spacer(1, 0.3*inch))
    
    # --- Engagement Summary ---
    story.append(Paragraph("Your Engagement", heading_style))
    
    engagement = analysis['engagement']
    engagement_data = [
        [Paragraph('Total Chat Sessions', body_style), Paragraph(str(engagement['total_sessions']), body_style)],
        [Paragraph('Assessments Completed', body_style), Paragraph(str(engagement['total_assessments']), body_style)],
        [Paragraph('Current Streak', body_style), Paragraph(f"**{engagement['current_streak']} days**", body_style)],
        [Paragraph('Longest Streak', body_style), Paragraph(f"{engagement['longest_streak']} days", body_style)],
        [Paragraph('Achievements Unlocked', body_style), Paragraph(str(engagement['achievements']), body_style)],
    ]
    
    engagement_table_style = TableStyle([
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 0), (-1, -1), COLOR_BACKGROUND),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
    ])

    engagement_table = Table(engagement_data, colWidths=[3*inch, 3*inch])
    engagement_table.setStyle(engagement_table_style)
    story.append(engagement_table)
    story.append(Paragraph("Instruction: High engagement (long streaks and high session counts) correlates with better tracking compliance and more comprehensive data for analysis.", instruction_style))
    story.append(Spacer(1, 0.3*inch))
    
    # --- Recommendations ---
    if include_recommendations:
        story.append(Paragraph("Personalized Recommendations", heading_style))
        story.append(Paragraph("Based on your recent data, here are actionable steps for your continued wellness:", body_style))
        
        recommendation_list = []
        for i, rec in enumerate(analysis['recommendations'], 1):
            recommendation_list.append(Paragraph(f"{i}. {rec}", body_style))
        
        story.extend(recommendation_list)
        story.append(Spacer(1, 0.3*inch))
    
    # --- Important Information ---
    story.append(PageBreak())
    story.append(Paragraph("Important Information & Disclaimer", heading_style))
    
    important_text = """
    <b>Data Privacy:</b> Your mental health information is encrypted and stored securely. This report is confidential.
    <br/><br/>
    <b>Crisis Support:</b> If you are in crisis or experiencing thoughts of self-harm, please contact emergency services immediately. PsyMitrix is a support tool, not a crisis response service.
    <br/><br/>
    <b>Disclaimer:</b> PsyMitrix is designed to support mental health, not replace professional care. Always consult with licensed healthcare providers for diagnosis and treatment plans.
    """
    story.append(Paragraph(important_text, body_style))
    story.append(Spacer(1, 0.3*inch))
    
    # Footer
    story.append(Spacer(1, 0.5*inch))
    footer_text = f"<i>Report generated by PsyMitrix on {datetime.utcnow().strftime('%B %d, %Y at %H:%M %Z')}</i>"
    story.append(Paragraph(footer_text, ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.grey,
        alignment=TA_CENTER
    )))
    
    doc.build(story)
    
    return filepath
