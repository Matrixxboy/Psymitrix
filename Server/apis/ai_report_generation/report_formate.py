import os
from datetime import datetime
import io # Import for in-memory operations

import numpy as np
from PIL import Image, ImageDraw
import matplotlib.pyplot as plt
import matplotlib.patches as patches

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image as RLImage,
    Table, TableStyle, PageBreak, KeepTogether
)
from reportlab.lib.units import cm, inch

# --- FANCY STYLING CONSTANTS ---
# Centralized color palette for easy customization
COLORS = {
    # Core UI Colors (Calm Pastel Brown Theme)
    "primary": "#7A5F44",        # Soft Warm Brown (Headers / Primary Text)
    "secondary": "#A67C52",      # Gentle Caramel (Buttons / Highlights)
    "accent": "#E8DCC5",         # Pale Sand Beige (Cards / Background)
    "title": "#4A3B2F",          # Deep Chocolate Brown (Titles)
    "contrast": "#C69C72",       # Muted Clay Peach (Accents / Hovers)
    
    # Layout Backgrounds
    "sidebar": "#5A4636",        # Earthy Walnut Brown (Sidebar)
    "gauge_background": "#F4EDE4",  # Warm Pastel Cream (Gauges / Panels)
    
    # Text Colors
    "body_text": "#5C5046",      # Soft Muted Taupe (Regular Text)
    "subtle_text": "#8B807A",    # Light Walnut Gray (Subtle Text)
    
    # Structural Elements
    "grid_lines": "#E2D7CC",     # Soft Cream Brown (Chart Grid Lines)
    
    # Base
    "white": "#FAF7F3",          # Off-white Warm Cream (Panels, Cards)
}


# 🎨 Distinct Chart Colors (for datasets, bars, lines, etc.)
CHART_COLORS = [
    "#3B82F6",  # Blue
    "#60A5FA",  # Sky Blue
    "#9333EA",  # Purple
    "#F59E0B",  # Amber
    "#10B981",  # Emerald Green
    "#EF4444",  # Red
    "#8B5CF6",  # Violet
    "#F97316",  # Orange
    "#0EA5E9",  # Light Cyan Blue
    "#14B8A6",  # Teal
]

COMPANY_NAME = "PsyMitrix"
company_info_mail = "info.psymitrix@gamil.com"
company_site = "psymitrix.vercel.app"
COMPANY_LOGO = "./psymitrix_logo.png"

# ---------------------------
# Utility: create placeholder logo (Returns buffer)
# ---------------------------
def make_placeholder_logo(size=(240, 240), bg=COLORS["primary"], circle=COLORS["accent"]):
    img = Image.new("RGBA", size, bg)
    draw = ImageDraw.Draw(img)
    
    cx, cy = size[0]//2, size[1]//2
    r_outer = min(size)//2 - 10
    
    # Draw a hexagon for a more modern, structured look
    points = []
    for i in range(6):
        angle = np.pi/2 + (2 * np.pi * i / 6)
        x = cx + r_outer * np.cos(angle)
        y = cy - r_outer * np.sin(angle)
        points.append((x, y))
    draw.polygon(points, fill=bg, outline=COLORS["secondary"], width=5)
    
    # Draw an inner circle
    r_inner = int(r_outer * 0.6)
    draw.ellipse([cx-r_inner, cy-r_inner, cx+r_inner, cy+r_inner], fill=circle)
    # small inner dot
    draw.ellipse([cx-12, cy-12, cx+12, cy+12], fill=bg)
    
    # Save to in-memory buffer
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer

# ---------------------------
# Charts: radar and bar using matplotlib (Returns buffer)
# ---------------------------
def create_radar_chart(radar_entries):
    labels = [e['field'] for e in radar_entries]
    values = [e['value'] for e in radar_entries] # Values are already 0-100
    N = len(labels)

    angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
    values += values[:1]
    angles += angles[:1]

    plt.style.use('default') 
    fig = plt.figure(figsize=(6, 6), dpi=200, facecolor='none') 
    ax = fig.add_subplot(111, polar=True, facecolor='none') 
    ax.set_theta_offset(np.pi / 2)
    ax.set_theta_direction(-1)

    ax.plot(angles, values, linewidth=2.5, linestyle='solid', color=COLORS["primary"])
    ax.fill(angles, values, alpha=0.55, facecolor=COLORS["secondary"], edgecolor=COLORS["primary"], linewidth=1)

    ax.set_thetagrids(np.degrees(angles[:-1]), labels, fontsize=9, color=COLORS["title"])
    ax.tick_params(axis='y', colors=COLORS["subtle_text"]) 
    ax.set_ylim(0, 100)
    ax.set_yticks([25, 50, 75, 100])
    ax.set_rlabel_position(180 / N)
    ax.grid(color=COLORS["grid_lines"], linestyle='-', linewidth=0.7)
    ax.spines['polar'].set_visible(False)
    
    fig.patch.set_alpha(0.0) 
    
    plt.tight_layout()
    
    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", transparent=True)
    plt.close(fig)
    buffer.seek(0)
    return buffer

def create_horizontal_bar_chart(bar_entries, title="Score Summary"):
    labels = [e['field'] for e in bar_entries]
    values = [e['value'] for e in bar_entries] # Values are already 0-100
    N = len(labels)
    
    bar_colors = [CHART_COLORS[i % len(CHART_COLORS)] for i in range(N)]

    plt.style.use('default')
    fig, ax = plt.subplots(figsize=(7, 3.5), dpi=200, facecolor='none')
    y_pos = np.arange(N)
    
    bars = ax.barh(y_pos, values, align='center', color=bar_colors, linewidth=0)
    
    ax.set_yticks(y_pos)
    ax.set_yticklabels(labels, fontsize=9, color=COLORS["title"])
    ax.invert_yaxis()
    ax.set_xlim(0, 100)
    ax.set_xlabel("Profile Score (0-100)", color=COLORS["primary"], fontsize=10)
    ax.tick_params(axis='x', colors=COLORS["subtle_text"])
    ax.grid(axis='x', linestyle='--', linewidth=0.5, color='#DDDDDD')
    
    ax.set_title(title, fontsize=12, color=COLORS["primary"], fontweight='bold', pad=10)
    
    for i, b in enumerate(bars):
        ax.text(b.get_width() + 1, b.get_y() + b.get_height()/2, 
                f"{int(values[i])}", va='center', fontsize=9, color=COLORS["primary"], fontweight='bold')

    ax.spines['right'].set_visible(False)
    ax.spines['top'].set_visible(False)
    ax.spines['left'].set_linewidth(0.5)
    ax.spines['bottom'].set_linewidth(0.5)

    fig.patch.set_alpha(0.0)
    plt.tight_layout()
    
    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", transparent=True)
    plt.close(fig)
    buffer.seek(0)
    return buffer

def create_comparison_bar_chart(entries, title="Trait Comparison"):
    labels = [e['field'] for e in entries]
    user_values = [e['value'] for e in entries]
    benchmark_values = [50] * len(labels)  # Static benchmark at 50
    N = len(labels)

    plt.style.use('default')
    fig, ax = plt.subplots(figsize=(8, 4), dpi=200, facecolor='none')
    x_pos = np.arange(N)
    
    # Plot user scores
    ax.bar(x_pos - 0.2, user_values, width=0.4, align='center', color=CHART_COLORS[0], label='Your Score')
    # Plot benchmark scores
    ax.bar(x_pos + 0.2, benchmark_values, width=0.4, align='center', color=CHART_COLORS[1], label='Benchmark')
    
    ax.set_xticks(x_pos)
    ax.set_xticklabels(labels, fontsize=9, color=COLORS["title"])
    ax.set_ylim(0, 100)
    ax.set_ylabel("Profile Score (0-100)", color=COLORS["primary"], fontsize=10)
    ax.tick_params(axis='y', colors=COLORS["subtle_text"])
    ax.grid(axis='y', linestyle='--', linewidth=0.5, color='#DDDDDD')
    
    ax.set_title(title, fontsize=12, color=COLORS["primary"], fontweight='bold', pad=10)
    ax.legend()

    ax.spines['right'].set_visible(False)
    ax.spines['top'].set_visible(False)
    ax.spines['left'].set_linewidth(0.5)
    ax.spines['bottom'].set_linewidth(0.5)

    fig.patch.set_alpha(0.0)
    plt.tight_layout()
    
    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", transparent=True)
    plt.close(fig)
    buffer.seek(0)
    return buffer

def create_vertical_bar_chart(bar_entries, title="Score Summary"):
    labels = [e['field'] for e in bar_entries]
    values = [e['value'] for e in bar_entries] # Values are already 0-100
    N = len(labels)
    
    bar_colors = [CHART_COLORS[i % len(CHART_COLORS)] for i in range(N)]

    plt.style.use('default')
    fig, ax = plt.subplots(figsize=(7, 3.5), dpi=200, facecolor='none')
    x_pos = np.arange(N)
    
    bars = ax.bar(x_pos, values, align='center', color=bar_colors, linewidth=0)
    
    ax.set_xticks(x_pos)
    ax.set_xticklabels(labels, fontsize=9, color=COLORS["title"])
    ax.set_ylim(0, 100)
    ax.set_ylabel("Profile Score (0-100)", color=COLORS["primary"], fontsize=10)
    ax.tick_params(axis='y', colors=COLORS["subtle_text"])
    ax.grid(axis='y', linestyle='--', linewidth=0.5, color='#DDDDDD')
    
    ax.set_title(title, fontsize=12, color=COLORS["primary"], fontweight='bold', pad=10)
    
    for i, b in enumerate(bars):
        ax.text(b.get_x() + b.get_width()/2, b.get_height() + 1, 
                f"{int(values[i])}", ha='center', fontsize=9, color=COLORS["primary"], fontweight='bold')

    ax.spines['right'].set_visible(False)
    ax.spines['top'].set_visible(False)
    ax.spines['left'].set_linewidth(0.5)
    ax.spines['bottom'].set_linewidth(0.5)

    fig.patch.set_alpha(0.0)
    plt.tight_layout()
    
    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", transparent=True)
    plt.close(fig)
    buffer.seek(0)
    return buffer

def create_donut_chart(entries, title="Strengths Distribution"):
    labels = [e['field'] for e in entries]
    values = [e['value'] for e in entries]
    N = len(labels)

    chart_colors = [CHART_COLORS[i % len(CHART_COLORS)] for i in range(N)]

    plt.style.use('default')
    fig, ax = plt.subplots(figsize=(6, 6), dpi=200, facecolor='none')

    wedges, texts, autotexts = ax.pie(values, labels=labels, colors=chart_colors, autopct='%1.1f%%', startangle=90, pctdistance=0.85)
    for autotext in autotexts:
        autotext.set_color(COLORS["white"])
        autotext.set_fontweight('bold')

    centre_circle = plt.Circle((0,0),0.70,fc=COLORS["white"])
    fig.gca().add_artist(centre_circle)

    ax.axis('equal')
    ax.set_title(title, fontsize=12, color=COLORS["primary"], fontweight='bold', pad=10)

    fig.patch.set_alpha(0.0)
    plt.tight_layout()

    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", transparent=True)
    plt.close(fig)
    buffer.seek(0)
    return buffer

def create_gauge_chart(score, title="Risk Profile"):
    # score is 0-100 for gauge
    fig, ax = plt.subplots(figsize=(6, 3.5), dpi=200, facecolor='none')

    ax.add_patch(patches.Circle((0.5, 0.4), 0.4, color=COLORS["gauge_background"], fill=True, zorder=1))
    ax.add_patch(patches.Circle((0.5, 0.4), 0.3, color=COLORS["white"], fill=True, zorder=1))

    theta = 180 - score * 1.8
    ax.add_patch(patches.Wedge((0.5, 0.4), 0.4, 180, theta, color=COLORS["primary"], zorder=2))
    ax.add_patch(patches.Circle((0.5, 0.4), 0.3, color=COLORS["white"], fill=True, zorder=3))

    ax.text(0.5, 0.4, f'{int(score)}', horizontalalignment='center', verticalalignment='center', fontsize=40, fontweight='bold', color=COLORS["primary"], zorder=4)
    ax.text(0.5, 0.25, title, horizontalalignment='center', verticalalignment='center', fontsize=12, color=COLORS["primary"], zorder=4)

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')

    fig.patch.set_alpha(0.0)
    plt.tight_layout()

    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", transparent=True)
    plt.close(fig)
    buffer.seek(0)
    return buffer

# ---------------------------
# PDF: header/footer
# ---------------------------
PAGE_WIDTH, PAGE_HEIGHT = A4

def header_footer(canvas, doc):
    canvas.saveState()
    
    canvas.setFillColor(colors.HexColor(COLORS["sidebar"]))
    canvas.rect(0, 0, 1.5*cm, PAGE_HEIGHT, fill=1, stroke=0)

    canvas.translate(1.0*cm, 8*cm)
    canvas.rotate(90)
    canvas.setFont("Helvetica-Bold", 12)
    canvas.setFillColor(colors.HexColor(COLORS["white"]))
    canvas.drawString(0, 0, COMPANY_NAME)
    canvas.restoreState()
    
    canvas.saveState()
    canvas.setFillColor(colors.HexColor(COLORS["primary"]))
    canvas.setFont("Helvetica-Bold", 10)
    canvas.drawString(2.5*cm, PAGE_HEIGHT - 2*cm, REPORT_TITLE) 
    
    canvas.setStrokeColor(colors.HexColor(COLORS["contrast"]))
    canvas.setLineWidth(1.5)
    canvas.line(2.5*cm, PAGE_HEIGHT - 2.2*cm, PAGE_WIDTH - 2*cm, PAGE_HEIGHT - 2.2*cm)

    canvas.setFont("Helvetica-Bold", 8)
    canvas.setFillColor(colors.HexColor(COLORS["primary"]))
    page_num_text = f"Page {canvas.getPageNumber()}"
    canvas.drawRightString(PAGE_WIDTH - 2*cm, 1.4*cm, page_num_text)

    canvas.setStrokeColor(colors.HexColor(COLORS["contrast"]))
    canvas.setLineWidth(1.5)
    canvas.line(2.5*cm, 1.8*cm, PAGE_WIDTH - 2*cm, 1.8*cm)

    canvas.setFont("Helvetica-Oblique", 8)
    canvas.setFillColor(colors.HexColor(COLORS["subtle_text"]))
    canvas.drawString(2.5*cm, 1.4*cm, f"We are {COMPANY_NAME}, dedicated to advancing careers and well-being. | {company_site}")
    canvas.restoreState()

def _create_chart_guide_table(data):
    styles = getSampleStyleSheet()
    if "BodyText" not in styles:
        styles.add(ParagraphStyle(name="BodyText", fontName='Helvetica', fontSize=10, leading=12))

    wrapped_data = [[Paragraph(str(cell), styles["BodyText"]) for cell in row] for row in data]

    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor(COLORS["accent"])),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor(COLORS["primary"])),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor(COLORS["primary"])),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor(COLORS["accent"])]),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ])

    table = Table(wrapped_data, colWidths=[100, 350], hAlign='LEFT')
    table.setStyle(style)
    return table

def _create_three_column_data_table(data):
    styles = getSampleStyleSheet()
    if "BodyText" not in styles:
        styles.add(ParagraphStyle(name="BodyText", fontName='Helvetica', fontSize=10, leading=12))

    wrapped_data = [[Paragraph(str(cell), styles["BodyText"]) for cell in row] for row in data]

    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor(COLORS["accent"])),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor(COLORS["primary"])),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor(COLORS["primary"])),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor(COLORS["accent"])]),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ])

    table = Table(wrapped_data, colWidths=[200, 125, 125], hAlign='LEFT')
    table.setStyle(style)
    return table

def _create_data_table(data):
    styles = getSampleStyleSheet()
    if "BodyText" not in styles:
        styles.add(ParagraphStyle(name="BodyText", fontName='Helvetica', fontSize=10, leading=12))

    wrapped_data = [[Paragraph(str(cell), styles["BodyText"]) for cell in row] for row in data]

    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor(COLORS["accent"])),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor(COLORS["primary"])),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor(COLORS["primary"])),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor(COLORS["accent"])]),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ])

    table = Table(wrapped_data, colWidths=[100, 350], hAlign='LEFT')
    table.setStyle(style)
    return table

def build_chart_story(title, chart_data, buffer, w, h, guide_data, styles):
    """Builds a story section for a single chart."""
    story = [
        Paragraph(title, styles["SectionHeader"]),
        Paragraph(chart_data.get("explanation", ""), styles["Body"]),
        Spacer(1, 0.5 * cm),
        RLImage(buffer, width=w * cm, height=h * cm, hAlign='CENTER'),
        Spacer(1, 0.5 * cm),
        Paragraph("Chart Data", styles["TraitTitle"]),
    ]

    # Handle single-value charts like Gauge
    if 'data' not in chart_data:
        data_list = [[title.split(':')[0].strip(), chart_data.get('value', 'N/A')]]
    else:
        data_list = [[e['field'], e['value']] for e in chart_data['data']]
    
    story.append(_create_data_table([["Field", "Value"]] + data_list))
    story.append(Spacer(1, 0.5 * cm))
    story.append(Paragraph("How to Read This Chart", styles["TraitTitle"]))
    story.append(_create_chart_guide_table([['Element', 'Description']] + guide_data))
    
    return KeepTogether(story)

def add_static_pages(story, styles):
    """Adds the static introduction and explanation pages to the story."""
    # Page 1: Report Overview
    story.append(Paragraph("1. Report Overview", styles["SectionHeader"]))
    story.append(Paragraph(
        "This <b>confidential report</b> summarizes your core personality, cognitive style, and motivational drivers. "
        "It is structured to provide an easy-to-digest profile for both personal growth and professional development.",
        styles["Body"]
    ))
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph("Key Components:", styles["TraitTitle"]))
    for p in ["Trait Breakdown", "Graphical Summaries", "Recommendations"]:
        story.append(Paragraph(f"• {p}", styles["CustomBullet"]))
    story.append(PageBreak())

    # Page 2: How to Read This Report
    story.append(Paragraph("2. How to Read This Report", styles["SectionHeader"]))
    story.append(Paragraph(
        "Each score reflects the intensity of the corresponding trait, interpreted along a standardized 1–10 scale.",
        styles["Body"]
    ))
    story.append(Spacer(1, 0.4*cm))
    story.append(Paragraph("Score Interpretation (1–10 Scale)", styles["TraitTitle"]))
    score_table_data = [
        [Paragraph(f"<b>{h}</b>", styles["Body"]) for h in ["Score Range", "Interpretation", "Meaning"]],
        [Paragraph("1–3", styles["Body"]), Paragraph("Low", styles["Body"]), Paragraph("Trait is less dominant.", styles["Body"])],
        [Paragraph("4–6", styles["Body"]), Paragraph("Balanced", styles["Body"]), Paragraph("Represents flexibility.", styles["Body"])],
        [Paragraph("7–10", styles["Body"]), Paragraph("High", styles["Body"]), Paragraph("Trait strongly defines behavior.", styles["Body"])],
    ]
    score_table = Table(score_table_data, colWidths=[70, 100, 300], repeatRows=1)
    score_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor(COLORS["accent"])),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor(COLORS["primary"])),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor(COLORS["accent"]), colors.white]),
        ('BOX', (0, 0), (-1, -1), 0.7, colors.HexColor(COLORS["primary"])),
        ('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor(COLORS["secondary"])),
    ]))
    story.append(score_table)
    story.append(PageBreak())

# ---------------------------
# Main PDF builder
# ---------------------------
def generate_personality_pdf(filename, data, person_name,generated_by):
    REPORT_TITLE = f"{person_name} Profile Report"
    logo_buffer = COMPANY_LOGO
    radar_buffer = create_radar_chart(data["sections"]["charts"]["radarChart"]["data"])
    bar_buffer = create_horizontal_bar_chart(data["sections"]["charts"]["barChart"]["data"], title="Core Attribute Summary")
    cognitive_bar_buffer = create_vertical_bar_chart(
        data["sections"]["barChart"]["data"], 
        title="Cognitive Score Summary" 
    )
    comparison_bar_buffer = create_comparison_bar_chart(data["sections"]["charts"]["comparisonTable"]["data"])
    donut_buffer = create_donut_chart(data["sections"]["charts"]["donutChart"]["data"])
    gauge_buffer = create_gauge_chart(data["sections"]["charts"]["gaugeChart"]["value"], title="Risk Profile")

    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=2.5*cm,
        rightMargin=2*cm,
        topMargin=2.6*cm,
        bottomMargin=2.2*cm,
        title=f"{person_name} - {REPORT_TITLE}"
    )

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="ReportTitle", alignment=1, fontSize=30, textColor=colors.HexColor(COLORS["title"]), spaceAfter=20, fontName="Helvetica-Bold"))
    styles.add(ParagraphStyle(name="ReportSubtitle", alignment=1, fontSize=14, textColor=colors.HexColor(COLORS["primary"]), spaceAfter=30, fontName="Helvetica"))
    styles.add(ParagraphStyle(name="SectionHeader", fontSize=16, textColor=colors.HexColor(COLORS["primary"]), spaceAfter=10, spaceBefore=20, fontName="Helvetica-Bold"))
    styles.add(ParagraphStyle(name="TraitTitle", fontSize=12, textColor=colors.HexColor(COLORS["title"]), spaceAfter=4, fontName="Helvetica-Bold"))
    styles.add(ParagraphStyle(name="CenteredBody", fontSize=10, leading=16, textColor=colors.HexColor(COLORS["body_text"]), fontName="Helvetica",alignment=1))
    styles.add(ParagraphStyle(name="Body", fontSize=10, leading=16, textColor=colors.HexColor(COLORS["body_text"]), fontName="Helvetica"))
    styles.add(ParagraphStyle(name="CustomBullet", parent=styles["Body"], leftIndent=0.5*cm, firstLineIndent=-0.5*cm))

    story = []

    # ----- COVER (Page 1) -----
    story.append(Spacer(1, 6*cm))
    story.append(RLImage(logo_buffer, width=4.5*cm, height=4.5*cm, hAlign='CENTER'))
    story.append(Spacer(1, 0.8*cm))
    story.append(Paragraph(f"<b>{person_name}'s</b>", styles["ReportTitle"]))
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph("Comprehensive Personality & Cognitive Profile", styles["ReportSubtitle"]))
    story.append(Spacer(1, 1*cm))
    story.append(Paragraph(f"Generated on: <b>{datetime.now().strftime('%B %d, %Y')}</b>", styles["CenteredBody"]))
    story.append(Paragraph(f"{COMPANY_NAME} Inc.", styles["CenteredBody"]))
    story.append(Paragraph(f"{company_info_mail} | {company_site}", styles["CenteredBody"]))
    story.append(Spacer(1, 2*cm))
    story.append(Paragraph(f"The Individual Profile of {person_name}'s Report Generated by {generated_by} using PsyMitrix Platform.", styles["CenteredBody"]))
    story.append(Paragraph("(Confidential — For recipient only.)", styles["CenteredBody"]))
    story.append(PageBreak())

    # ----- TABLE OF CONTENTS (Page 2) -----
    story.append(Paragraph("Table of Contents", styles["ReportTitle"]))
    story.append(Spacer(1, 0.5*cm))
    
    toc_data = [
        ("1. Report Overview", 3), ("2. How to Read This Report", 4),
        ("3. Personality Breakdown", 5), ("4. Cognitive Profile", 6),
        ("5. Radar Chart", 7), ("6. Bar Chart", 8),
        ("7. Comparison Chart", 9), ("8. Donut Chart", 10),
        ("9. Gauge Chart", 11), ("10. Recommendations", 12),
        ("11. Next Steps", 13)
    ]
    
    toc_table_data = [[f"{i+1}.", title, f".... {page}"] for i, (title, page) in enumerate(toc_data)]
    toc_table = Table(toc_table_data, colWidths=[30, 420, 50])
    toc_table.setStyle(TableStyle([
        ('TEXTCOLOR', (0,0), (-1,-1), colors.HexColor(COLORS["title"])),
        ('FONTSIZE', (0,0), (-1,-1), 11),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LINEBELOW', (0,0), (-1,-1), 0.25, colors.HexColor(COLORS["secondary"])),
    ]))
    story.append(toc_table)
    story.append(PageBreak())

    # --- STATIC CONTENT PAGES ---
    add_static_pages(story, styles)

    # --- CORE REPORT CONTENT ---
    story.append(Paragraph("3. Personality Breakdown", styles["SectionHeader"]))
    for trait, desc in data["sections"]["report"].items():
        story.append(KeepTogether([
            Paragraph(trait, styles["TraitTitle"]),
            Paragraph(desc, styles["Body"]),
            Spacer(1, 0.3*cm)
        ]))
    story.append(PageBreak())

    story.append(Paragraph("4. Cognitive Profile Overview", styles["SectionHeader"]))
    story.append(Paragraph(
        "This section details your cognitive functioning. The following chart visualizes your performance across core cognitive domains.",
        styles["Body"]
    ))
    story.append(Spacer(1, 0.5*cm))
    story.append(PageBreak())

    # ----- CHARTS -----
    chart_definitions = [
        ("5. Radar Chart of Traits", data["sections"]["charts"]["radarChart"], radar_buffer, 12, 12, [
            ['Axes', 'Each axis represents a different personality trait.'],
            ['Value', 'The further the point is from the center, the higher the score.']
        ]),
        ("6. Bar Chart Summary (Core Attributes)", data["sections"]["charts"]["barChart"], bar_buffer, 14, 7, [
            ['Bars', 'Each horizontal bar represents a core attribute.'],
            ['Length', 'The length of the bar corresponds to your score (0-100).']
        ]),
        ("7. Cognitive Score Chart", data["sections"]["barChart"], cognitive_bar_buffer, 14, 7, [
            ['Bars', 'Each vertical bar represents a cognitive ability.'],
            ['Height', 'The height of the bar shows your score.']
        ]),
        ("8. Trait Comparison Chart", data["sections"]["charts"]["comparisonTable"], comparison_bar_buffer, 16, 8, [
            ['Your Score', 'The dark bar representing your score.'],
            ['Benchmark', 'The lighter bar representing the population average (50).']
        ]),
        ("9. Donut Chart of Strengths", data["sections"]["charts"]["donutChart"], donut_buffer, 12, 12, [
            ['Slices', 'Each slice represents a different strength.'],
            ['Size', 'The size of the slice corresponds to the score.']
        ]),
        ("10. Gauge Chart: Risk Profile", data["sections"]["charts"]["gaugeChart"], gauge_buffer, 12, 7, [
            ['Value', 'The value represents the risk profile score.'],
            ['Color', 'The color of the gauge indicates the level of risk.']
        ])
    ]

    for title, chart_data, buffer, w, h, guide_data in chart_definitions:
        story.append(build_chart_story(title, chart_data, buffer, w, h, guide_data, styles))
        story.append(PageBreak())

    # ----- RECOMMENDATIONS & NEXT STEPS -----
    story.append(Paragraph("11. Career Fit Recommendations", styles["SectionHeader"]))
    story.append(Paragraph("These recommendations suggest environments and roles where you are likely to thrive.", styles["Body"]))
    story.append(Spacer(1, 0.3*cm))
    
    insights = [
        "<b>Strengths Leverage:</b> Utilize high openness and strong logical reasoning in roles requiring creativity and analytical problem-solving.",
        "<b>Growth Areas Focus:</b> Target spontaneous engagement and social energy development through varied networking opportunities.",
        "<b>Optimal Career Fit:</b> Analytical and structured roles (e.g., data analysis, engineering) are best suited.",
        "<b>Ideal Environment:</b> Seek environments that provide clear goals and autonomy."
    ]
    for p in insights:
        story.append(Paragraph("• " + p, styles["CustomBullet"]))
    story.append(PageBreak())

    story.append(Paragraph("12. Next Steps", styles["SectionHeader"]))
    story.append(Paragraph("Use these steps to integrate your profile results into your development goals.", styles["Body"]))
    story.append(Spacer(1, 0.5*cm))
    
    next_steps_list = [
        "<b>Discuss & Validate</b>: Share this report with a trusted mentor or coach.",
        "<b>Set a SMART Goal</b>: Choose one 'Growth Area' and set a specific, measurable goal for the next 90 days.",
        "<b>Track Success</b>: Document instances where your strengths helped you succeed.",
        "<b>Revisit in Six Months</b>: Personal development is cyclical. Revisit this report to measure growth."
    ]
    for p in next_steps_list:
        story.append(Paragraph("• " + p, styles["CustomBullet"]))

    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
