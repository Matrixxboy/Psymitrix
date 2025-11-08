import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime, timedelta
import tempfile
import os
from io import BytesIO
import json
from typing import Optional, Dict, List
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from models.user_model import User, Mood
from datetime import date as date_class

def calculate_age(birthdate) -> int:
    """Calculate age from birthdate"""
    if not birthdate:
        return None
    today = date_class.today()
    return today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))

def get_birth_season_analysis(birthdate) -> Dict:
    """Get birth season characteristics based on research"""
    if not birthdate:
        return {"season": "Unknown", "characteristics": []}
    
    month = birthdate.month
    
    # Birth season characteristics based on numerology and research
    seasons = {
        "Winter (Dec-Feb)": {
            "months": [12, 1, 2],
            "characteristics": [
                "Often show introspective and philosophical nature",
                "May have higher creative potential",
                "Winter births associated with resilience",
                "Research suggests potential for leadership qualities"
            ]
        },
        "Spring (Mar-May)": {
            "months": [3, 4, 5],
            "characteristics": [
                "Often display optimism and enthusiasm",
                "Spring births show higher extraversion",
                "Associated with new beginnings and growth mindset",
                "Research suggests better mood stability during spring births"
            ]
        },
        "Summer (Jun-Aug)": {
            "months": [6, 7, 8],
            "characteristics": [
                "Often show warmth and social connectedness",
                "Summer births associated with positive affect",
                "Higher social engagement capacity",
                "Research indicates better stress resilience"
            ]
        },
        "Autumn (Sep-Nov)": {
            "months": [9, 10, 11],
            "characteristics": [
                "Often display analytical and practical thinking",
                "Autumn births show organizational strengths",
                "Associated with preparation and planning abilities",
                "Research suggests good emotional regulation"
            ]
        }
    }
    
    for season, data in seasons.items():
        if month in data["months"]:
            return {"season": season, "characteristics": data["characteristics"]}
    
    return {"season": "Unknown", "characteristics": []}

def get_blood_group_analysis(bloodgroup: Optional[str]) -> Dict:
    """Get blood group personality characteristics based on Japanese research"""
    if not bloodgroup:
        return {"blood_group": "Unknown", "traits": [], "compatibility": []}
    
    # Japanese blood type theory (popular psychology, not scientifically validated)
    blood_type_profiles = {
        "A": {
            "traits": [
                "Conscientious and responsible",
                "Detail-oriented and methodical",
                "Perfectionist tendencies",
                "Good at planning and organization",
                "May experience higher anxiety in uncertain situations"
            ],
            "strengths": ["Reliability", "Patience", "Organization"],
            "growth_areas": ["Flexibility", "Risk-taking", "Spontaneity"]
        },
        "B": {
            "traits": [
                "Creative and flexible",
                "Independent and individualistic",
                "Adaptable to change",
                "Passionate about interests",
                "May struggle with structure"
            ],
            "strengths": ["Creativity", "Adaptability", "Optimism"],
            "growth_areas": ["Consistency", "Following through", "Teamwork"]
        },
        "AB": {
            "traits": [
                "Balanced and thoughtful",
                "Both analytical and creative",
                "Reserved yet sociable",
                "Deep thinking capacity",
                "May appear contradictory"
            ],
            "strengths": ["Balance", "Intelligence", "Diplomacy"],
            "growth_areas": ["Decision-making", "Commitment", "Emotional expression"]
        },
        "O": {
            "traits": [
                "Outgoing and social",
                "Passionate and confident",
                "Natural leaders",
                "Enthusiastic and energetic",
                "May lack patience"
            ],
            "strengths": ["Leadership", "Confidence", "Enthusiasm"],
            "growth_areas": ["Patience", "Focus", "Sensitivity to others"]
        }
    }
    
    return blood_type_profiles.get(bloodgroup, {"blood_group": "Unknown", "traits": [], "strengths": [], "growth_areas": []})

def get_birth_order_analysis(older_siblings: Optional[int], younger_siblings: Optional[int]) -> Dict:
    """Get personality analysis based on Frank Salloway and Kevin Leman's birth order theory"""
    
    older_count = older_siblings or 0
    younger_count = younger_siblings or 0
    
    # Determine birth order position
    if older_count == 0 and younger_count == 0:
        position = "Only Child"
        traits = [
            "Often mature and responsible beyond years",
            "May have high expectations of self",
            "Strong focus on achievement",
            "Can be a perfectionist",
            "May struggle with sharing or group dynamics"
        ]
    elif older_count == 0:
        position = "Firstborn/Eldest"
        traits = [
            "Natural leadership inclinations",
            "Responsible and reliable",
            "Achievement-oriented",
            "May be overly critical of self and others",
            "Often serves as role model for siblings"
        ]
    elif younger_count == 0:
        position = "Youngest Child"
        traits = [
            "Often more relaxed and outgoing",
            "May be attention-seeking",
            "Creative and less rule-bound",
            "Good at interpersonal relationships",
            "May struggle with self-discipline"
        ]
    else:
        position = "Middle Child"
        traits = [
            "Often peacemakers and diplomats",
            "May feel overlooked or neglected",
            "Strong negotiation skills",
            "Independent and flexible",
            "Often have many friends outside family"
        ]
    
    return {
        "birth_order": position,
        "traits": traits,
        "sibling_dynamics": {
            "older_siblings": older_count,
            "younger_siblings": younger_count,
            "total_siblings": older_count + younger_count
        }
    }

def calculate_mental_health_analysis(user: User) -> Dict:
    """Calculate comprehensive mental health analysis"""
    
    analysis = {
        "personal_profile": {
            "age": calculate_age(user.birthdate),
            "gender": user.gender,
            "occupation": user.occupation,
            "location": user.location
        },
        "assessment_summary": {},
        "mood_trends": {},
        "lifestyle_factors": {
            "engagement_level": "High" if user.interactions > 20 else "Medium" if user.interactions > 5 else "Low",
            "total_interactions": user.interactions,
            "session_count": len(user.sessions)
        },
        "research_based_insights": {}
    }
    
    # Assessment summary
    if user.mental_health_profile.assessment_results:
        phq9_scores = [a.score for a in user.mental_health_profile.assessment_results if a.assessment_type == "PHQ-9"]
        gad7_scores = [a.score for a in user.mental_health_profile.assessment_results if a.assessment_type == "GAD-7"]
        
        if phq9_scores:
            analysis["assessment_summary"]["phq9"] = {
                "latest_score": phq9_scores[-1],
                "average_score": sum(phq9_scores) / len(phq9_scores),
                "trend": "improving" if len(phq9_scores) > 1 and phq9_scores[-1] < phq9_scores[-2] else "declining" if len(phq9_scores) > 1 and phq9_scores[-1] > phq9_scores[-2] else "stable"
            }
        
        if gad7_scores:
            analysis["assessment_summary"]["gad7"] = {
                "latest_score": gad7_scores[-1],
                "average_score": sum(gad7_scores) / len(gad7_scores),
                "trend": "improving" if len(gad7_scores) > 1 and gad7_scores[-1] < gad7_scores[-2] else "declining" if len(gad7_scores) > 1 and gad7_scores[-1] > gad7_scores[-2] else "stable"
            }
    
    # Mood trends
    if user.mood_trends:
        mood_counts = {}
        for mood in user.mood_trends[-30:]:
            mood_counts[mood.mood] = mood_counts.get(mood.mood, 0) + 1
        
        analysis["mood_trends"] = {
            "most_common_mood": max(mood_counts, key=mood_counts.get) if mood_counts else None,
            "mood_distribution": mood_counts,
            "last_recorded": user.mood_trends[-1].mood if user.mood_trends else None
        }
    
    # Research-based insights
    analysis["research_based_insights"]["birth_season"] = get_birth_season_analysis(user.birthdate)
    analysis["research_based_insights"]["blood_type"] = get_blood_group_analysis(user.bloodgroup)
    analysis["research_based_insights"]["birth_order"] = get_birth_order_analysis(user.olderSiblings, user.youngerSiblings)
    
    return analysis

def create_assessment_chart(user: User) -> Image:
    """Create a chart of assessment scores over time"""
    plt.figure(figsize=(10, 5))
    
    phq9_scores = [(a.date, a.score) for a in user.mental_health_profile.assessment_results if a.assessment_type == "PHQ-9"]
    gad7_scores = [(a.date, a.score) for a in user.mental_health_profile.assessment_results if a.assessment_type == "GAD-7"]
    
    if phq9_scores:
        dates, scores = zip(*phq9_scores)
        plt.plot(dates, scores, marker='o', label='PHQ-9 (Depression)', color='#A5645A', linewidth=2)
    
    if gad7_scores:
        dates, scores = zip(*gad7_scores)
        plt.plot(dates, scores, marker='s', label='GAD-7 (Anxiety)', color='#E1A79E', linewidth=2)
    
    plt.title("Mental Health Assessment Scores Over Time", fontsize=14, fontweight='bold')
    plt.xlabel("Date", fontsize=12)
    plt.ylabel("Score", fontsize=12)
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.xticks(rotation=45)
    plt.tight_layout()
    
    img_buffer = BytesIO()
    plt.savefig(img_buffer, format='png', dpi=100, bbox_inches='tight')
    img_buffer.seek(0)
    plt.close()
    
    return img_buffer

def create_mood_chart(user: User) -> Image:
    """Create a chart of mood distribution"""
    plt.figure(figsize=(10, 5))
    
    mood_counts = {}
    for mood in user.mood_trends[-30:]:
        mood_counts[mood.mood] = mood_counts.get(mood.mood, 0) + 1
    
    if mood_counts:
        moods = list(mood_counts.keys())
        counts = list(mood_counts.values())
        colors_map = {
            "excited": "#27AE60",
            "happy": "#F2C94C",
            "calm": "#A5645A",
            "neutral": "#4A433F",
            "sad": "#EB5757",
            "angry": "#8B0000"
        }
        bar_colors = [colors_map.get(m, "#999999") for m in moods]
        
        plt.bar(moods, counts, color=bar_colors)
        plt.title("Mood Distribution (Last 30 Days)", fontsize=14, fontweight='bold')
        plt.xlabel("Mood", fontsize=12)
        plt.ylabel("Frequency", fontsize=12)
        plt.xticks(rotation=45)
        plt.grid(True, alpha=0.3, axis='y')
        plt.tight_layout()
    
    img_buffer = BytesIO()
    plt.savefig(img_buffer, format='png', dpi=100, bbox_inches='tight')
    img_buffer.seek(0)
    plt.close()
    
    return img_buffer

def generate_mental_health_report(
    user: User,
    include_assessments: bool = True,
    include_mood_trends: bool = True,
    include_recommendations: bool = True,
    date_range_days: Optional[int] = 30
) -> str:
    """
    Generate a comprehensive mental health PDF report
    """
    
    # Calculate analysis
    analysis = calculate_mental_health_analysis(user)
    
    # Create PDF
    temp_dir = tempfile.gettempdir()
    pdf_filename = f"{user.user_id}_mental_health_report_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.pdf"
    pdf_path = os.path.join(temp_dir, pdf_filename)
    
    doc = SimpleDocTemplate(pdf_path, pagesize=letter)
    story = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#A5645A'),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#4B2F2A'),
        spaceAfter=12,
        spaceBefore=12
    )
    
    # Title
    story.append(Paragraph("Mental Health Report", title_style))
    story.append(Paragraph(f"Generated: {datetime.utcnow().strftime('%B %d, %Y at %I:%M %p')}", styles['Normal']))
    story.append(Spacer(1, 0.3*inch))
    
    # User Information
    story.append(Paragraph("Personal Information", heading_style))
    user_info = [
        ["Name:", f"{user.firstName} {user.lastName}"],
        ["Age:", str(analysis["personal_profile"]["age"])],
        ["Gender:", str(analysis["personal_profile"]["gender"])],
        ["Occupation:", str(analysis["personal_profile"]["occupation"])],
        ["Member Since:", user.created_at.strftime("%B %d, %Y")]
    ]
    user_table = Table(user_info, colWidths=[2*inch, 4*inch])
    user_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F4F4F2')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey)
    ]))
    story.append(user_table)
    story.append(Spacer(1, 0.3*inch))
    
    # Assessment Summary
    if include_assessments and analysis["assessment_summary"]:
        story.append(Paragraph("Assessment Summary", heading_style))
        
        assessment_data = []
        if "phq9" in analysis["assessment_summary"]:
            phq9 = analysis["assessment_summary"]["phq9"]
            assessment_data.append([
                "PHQ-9 (Depression)",
                f"Latest: {phq9['latest_score']}",
                f"Avg: {phq9['average_score']:.1f}",
                phq9['trend'].capitalize()
            ])
        
        if "gad7" in analysis["assessment_summary"]:
            gad7 = analysis["assessment_summary"]["gad7"]
            assessment_data.append([
                "GAD-7 (Anxiety)",
                f"Latest: {gad7['latest_score']}",
                f"Avg: {gad7['average_score']:.1f}",
                gad7['trend'].capitalize()
            ])
        
        if assessment_data:
            assessment_table = Table([["Assessment", "Latest Score", "Average", "Trend"]] + assessment_data)
            assessment_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#A5645A')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey)
            ]))
            story.append(assessment_table)
            story.append(Spacer(1, 0.3*inch))
        
        # Assessment chart
        try:
            chart_img = create_assessment_chart(user)
            img = Image(chart_img, width=6*inch, height=3*inch)
            story.append(img)
            story.append(Spacer(1, 0.2*inch))
        except:
            pass
    
    # Mood Trends
    if include_mood_trends and analysis["mood_trends"]:
        story.append(PageBreak())
        story.append(Paragraph("Mood Trends", heading_style))
        
        mood_data = [
            ["Most Common Mood:", str(analysis["mood_trends"].get("most_common_mood", "N/A")).capitalize()],
            ["Last Recorded Mood:", str(analysis["mood_trends"].get("last_recorded", "N/A")).capitalize()],
        ]
        mood_table = Table(mood_data, colWidths=[2*inch, 4*inch])
        mood_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F4F4F2')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey)
        ]))
        story.append(mood_table)
        story.append(Spacer(1, 0.2*inch))
        
        # Mood chart
        try:
            mood_chart_img = create_mood_chart(user)
            img = Image(mood_chart_img, width=6*inch, height=3*inch)
            story.append(img)
            story.append(Spacer(1, 0.2*inch))
        except:
            pass
    
    # Research-Based Insights
    story.append(PageBreak())
    story.append(Paragraph("Research-Based Insights", heading_style))
    
    # Birth Season
    birth_season = analysis["research_based_insights"]["birth_season"]
    if birth_season["season"] != "Unknown":
        story.append(Paragraph(f"Birth Season: {birth_season['season']}", styles['Heading3']))
        for char in birth_season["characteristics"]:
            story.append(Paragraph(f"• {char}", styles['Normal']))
        story.append(Spacer(1, 0.1*inch))
    
    # Blood Type
    blood_type = analysis["research_based_insights"]["blood_type"]
    if blood_type.get("blood_group") != "Unknown":
        story.append(Paragraph(f"Blood Type Profile: {blood_type['blood_group']}", styles['Heading3']))
        story.append(Paragraph("Characteristics:", styles['Normal']))
        for trait in blood_type.get("traits", []):
            story.append(Paragraph(f"• {trait}", styles['Normal']))
        story.append(Paragraph("Strengths:", styles['Normal']))
        for strength in blood_type.get("strengths", []):
            story.append(Paragraph(f"• {strength}", styles['Normal']))
        story.append(Spacer(1, 0.1*inch))
    
    # Birth Order
    birth_order = analysis["research_based_insights"]["birth_order"]
    story.append(Paragraph(f"Birth Order: {birth_order['birth_order']}", styles['Heading3']))
    for trait in birth_order["traits"]:
        story.append(Paragraph(f"• {trait}", styles['Normal']))
    story.append(Spacer(1, 0.1*inch))
    
    # Recommendations
    if include_recommendations:
        story.append(PageBreak())
        story.append(Paragraph("Recommendations", heading_style))
        
        recommendations = [
            "1. Continue regular mental health assessments to track progress",
            "2. Engage with the AI psychiatrist assistant for daily support and guidance",
            "3. Maintain consistent mood tracking for pattern identification",
            "4. Practice self-care activities: exercise, sleep, and social connection",
            "5. Consider professional mental health support if symptoms persist",
            "6. Use breathing and mindfulness techniques during moments of stress",
            "7. Keep this report confidential and secure"
        ]
        
        for rec in recommendations:
            story.append(Paragraph(rec, styles['Normal']))
    
    # Build PDF
    doc.build(story)
    
    return pdf_path
