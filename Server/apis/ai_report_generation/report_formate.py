# pdf_generator.py
import os
from datetime import datetime
import io
import math

import numpy as np
from PIL import Image, ImageDraw
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as patches

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image as RLImage,
    Table, TableStyle, PageBreak, KeepTogether
)
from reportlab.lib.units import cm
from reportlab.lib.utils import ImageReader

# ---------------------------
# Theme & Constants
# ---------------------------
COLORS = {
    "primary": "#7A5F44",
    "secondary": "#A67C52",
    "accent": "#E8DCC5",
    "title": "#4A3B2F",
    "contrast": "#C69C72",
    "sidebar": "#5A4636",
    "gauge_background": "#F4EDE4",
    "body_text": "#5C5046",
    "subtle_text": "#8B807A",
    "grid_lines": "#E2D7CC",
    "white": "#FAF7F3",
}

CHART_COLORS = [
    "#3B82F6", "#60A5FA", "#9333EA", "#F59E0B",
    "#10B981", "#EF4444", "#8B5CF6", "#F97316",
    "#0EA5E9", "#14B8A6",
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
COMPANY_LOGO = os.path.join(BASE_DIR, "psymitrix_logo.png")
COMPANY_NAME = "PsyMitrix"
company_info_mail = "info.psymitrix@gamil.com"
company_site = "psymitrix.vercel.app"

PAGE_WIDTH, PAGE_HEIGHT = A4

# ---------------------------
# Utilities
# ---------------------------
def safe_open_image(path):
    """Return BytesIO of image or None."""
    try:
        with open(path, "rb") as f:
            b = io.BytesIO(f.read())
            b.seek(0)
            return b
    except Exception:
        return None

def make_placeholder_logo(size=(240, 240), bg=COLORS["primary"], circle=COLORS["accent"]):
    """Create a simple in-memory placeholder logo (PNG BytesIO)."""
    img = Image.new("RGBA", size, bg)
    draw = ImageDraw.Draw(img)
    cx, cy = size[0] // 2, size[1] // 2
    r_outer = min(size) // 2 - 10
    points = []
    for i in range(6):
        angle = math.pi / 2 + (2 * math.pi * i / 6)
        x = cx + r_outer * math.cos(angle)
        y = cy - r_outer * math.sin(angle)
        points.append((x, y))
    draw.polygon(points, fill=bg, outline=COLORS["secondary"])
    r_inner = int(r_outer * 0.6)
    draw.ellipse([cx - r_inner, cy - r_inner, cx + r_inner, cy + r_inner], fill=circle)
    draw.ellipse([cx - 12, cy - 12, cx + 12, cy + 12], fill=bg)
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer

# ---------------------------
# Chart Generators
# All charts:
#   • Use matplotlib
#   • Render ONLY into in-memory BytesIO buffers
#   • NEVER write image files to disk
# ---------------------------
def _empty_buffer():
    return io.BytesIO()

def create_radar_chart(radar_entries):
    try:
        if not radar_entries:
            return _empty_buffer()
        labels = [str(e.get("field", "")) for e in radar_entries]
        values = []
        for e in radar_entries:
            try:
                values.append(float(e.get("value", 0)))
            except Exception:
                values.append(0.0)
        N = len(labels)
        if N == 0:
            return _empty_buffer()
        angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
        values = values + values[:1]
        angles = angles + angles[:1]

        fig = plt.figure(figsize=(6, 6), dpi=150, facecolor='none')
        ax = fig.add_subplot(111, polar=True, facecolor='none')
        ax.set_theta_offset(np.pi / 2)
        ax.set_theta_direction(-1)

        ax.plot(angles, values, linewidth=2.2, linestyle='solid', color=COLORS["primary"])
        ax.fill(angles, values, alpha=0.45, facecolor=COLORS["secondary"], edgecolor=COLORS["primary"])

        ax.set_thetagrids(np.degrees(angles[:-1]), labels, fontsize=9, color=COLORS["title"])
        ax.set_ylim(0, 100)
        ax.set_yticks([25, 50, 75, 100])
        ax.tick_params(axis='y', colors=COLORS["subtle_text"])
        ax.grid(color=COLORS["grid_lines"], linestyle='-', linewidth=0.7)
        ax.spines['polar'].set_visible(False)

        fig.patch.set_alpha(0.0)
        plt.tight_layout()
        buf = io.BytesIO()
        fig.savefig(buf, format="png", transparent=True)
        plt.close(fig)
        buf.seek(0)
        return buf
    except Exception:
        return _empty_buffer()

def create_horizontal_bar_chart(bar_entries, title="Score Summary"):
    try:
        if not bar_entries:
            return _empty_buffer()
        labels = [str(e.get("field", "")) for e in bar_entries]
        values = []
        for e in bar_entries:
            try:
                values.append(float(e.get("value", 0)))
            except Exception:
                values.append(0.0)
        N = len(labels)
        if N == 0:
            return _empty_buffer()
        colors_list = [CHART_COLORS[i % len(CHART_COLORS)] for i in range(N)]

        fig, ax = plt.subplots(figsize=(7, 3.5), dpi=150, facecolor='none')
        y_pos = np.arange(N)
        bars = ax.barh(y_pos, values, align='center', color=colors_list, edgecolor='none')

        ax.set_yticks(y_pos)
        ax.set_yticklabels(labels, fontsize=9, color=COLORS["title"])
        ax.invert_yaxis()
        ax.set_xlim(0, 100)
        ax.set_xlabel("Profile Score (0–100)", color=COLORS["primary"], fontsize=10)
        ax.tick_params(axis='x', colors=COLORS["subtle_text"])
        ax.grid(axis='x', linestyle='--', linewidth=0.5, color='#E8E4E1')
        ax.set_title(title, fontsize=12, color=COLORS["primary"], pad=8, fontweight='bold')

        for i, b in enumerate(bars):
            ax.text(b.get_width() + 1, b.get_y() + b.get_height() / 2,
                    f"{int(values[i])}", va='center', fontsize=9, color=COLORS["primary"])

        ax.spines['right'].set_visible(False)
        ax.spines['top'].set_visible(False)
        ax.spines['left'].set_linewidth(0.5)
        ax.spines['bottom'].set_linewidth(0.5)

        fig.patch.set_alpha(0.0)
        plt.tight_layout()
        buf = io.BytesIO()
        fig.savefig(buf, format="png", transparent=True)
        plt.close(fig)
        buf.seek(0)
        return buf
    except Exception:
        return _empty_buffer()

def create_vertical_bar_chart(bar_entries, title="Score Summary"):
    try:
        if not bar_entries:
            return _empty_buffer()
        labels = [str(e.get("field", "")) for e in bar_entries]
        values = []
        for e in bar_entries:
            try:
                values.append(float(e.get("value", 0)))
            except Exception:
                values.append(0.0)
        N = len(labels)
        if N == 0:
            return _empty_buffer()
        colors_list = [CHART_COLORS[i % len(CHART_COLORS)] for i in range(N)]

        fig, ax = plt.subplots(figsize=(7, 3.5), dpi=150, facecolor='none')
        x_pos = np.arange(N)
        bars = ax.bar(x_pos, values, align='center', color=colors_list)

        ax.set_xticks(x_pos)
        ax.set_xticklabels(labels, fontsize=9, color=COLORS["title"], rotation=25)
        ax.set_ylim(0, 100)
        ax.set_ylabel("Profile Score (0–100)", color=COLORS["primary"], fontsize=10)
        ax.tick_params(axis='y', colors=COLORS["subtle_text"])
        ax.grid(axis='y', linestyle='--', linewidth=0.5, color='#E8E4E1')
        ax.set_title(title, fontsize=12, color=COLORS["primary"], pad=8, fontweight='bold')

        for i, b in enumerate(bars):
            ax.text(b.get_x() + b.get_width() / 2, b.get_height() + 1,
                    f"{int(values[i])}", ha='center', fontsize=9, color=COLORS["primary"])

        ax.spines['right'].set_visible(False)
        ax.spines['top'].set_visible(False)
        ax.spines['left'].set_linewidth(0.5)
        ax.spines['bottom'].set_linewidth(0.5)

        fig.patch.set_alpha(0.0)
        plt.tight_layout()
        buf = io.BytesIO()
        fig.savefig(buf, format="png", transparent=True)
        plt.close(fig)
        buf.seek(0)
        return buf
    except Exception:
        return _empty_buffer()

def create_comparison_bar_chart(entries, title="Trait Comparison"):
    try:
        if not entries:
            return _empty_buffer()
        labels = [str(e.get("field", "")) for e in entries]
        user_values = []
        for e in entries:
            try:
                user_values.append(float(e.get("value", 0)))
            except Exception:
                user_values.append(0.0)
        benchmark_values = [50] * len(labels)

        fig, ax = plt.subplots(figsize=(8, 4), dpi=150, facecolor='none')
        x_pos = np.arange(len(labels))

        ax.bar(x_pos - 0.2, user_values, width=0.4, color=CHART_COLORS[0], label='Your Score')
        ax.bar(x_pos + 0.2, benchmark_values, width=0.4, color=CHART_COLORS[1], label='Benchmark')

        ax.set_xticks(x_pos)
        ax.set_xticklabels(labels, fontsize=9, color=COLORS["title"], rotation=20)
        ax.set_ylim(0, 100)
        ax.set_ylabel("Profile Score (0–100)", color=COLORS["primary"])
        ax.set_title(title, fontsize=12, color=COLORS["primary"], pad=8, fontweight='bold')
        ax.tick_params(axis='y', colors=COLORS["subtle_text"])
        ax.grid(axis='y', linestyle='--', linewidth=0.5, color='#E8E4E1')
        ax.legend(frameon=False)

        ax.spines['right'].set_visible(False)
        ax.spines['top'].set_visible(False)

        fig.patch.set_alpha(0.0)
        plt.tight_layout()
        buf = io.BytesIO()
        fig.savefig(buf, format="png", transparent=True)
        plt.close(fig)
        buf.seek(0)
        return buf
    except Exception:
        return _empty_buffer()

def create_donut_chart(entries, title="Strengths Distribution"):
    try:
        if not entries:
            return _empty_buffer()
        labels = [str(e.get("field", "")) for e in entries]
        values = []
        for e in entries:
            try:
                values.append(float(e.get("value", 0)))
            except Exception:
                values.append(0.0)
        if len(labels) == 0:
            return _empty_buffer()
        colors_list = [CHART_COLORS[i % len(CHART_COLORS)] for i in range(len(labels))]

        fig, ax = plt.subplots(figsize=(6, 6), dpi=150, facecolor='none')
        wedges, texts, autotexts = ax.pie(
            values,
            labels=labels,
            colors=colors_list,
            autopct='%1.1f%%',
            startangle=90,
            pctdistance=0.78
        )
        for autotext in autotexts:
            autotext.set_color(COLORS["white"])
            autotext.set_fontweight('bold')
        centre = plt.Circle((0, 0), 0.65, fc=COLORS["white"])
        fig.gca().add_artist(centre)
        ax.axis('equal')
        ax.set_title(title, fontsize=12, color=COLORS["primary"], pad=8, fontweight='bold')

        fig.patch.set_alpha(0.0)
        plt.tight_layout()
        buf = io.BytesIO()
        fig.savefig(buf, format="png", transparent=True)
        plt.close(fig)
        buf.seek(0)
        return buf
    except Exception:
        return _empty_buffer()

def create_gauge_chart(score, title="Risk Profile"):
    try:
        try:
            score = float(score)
        except Exception:
            score = 0.0

        fig, ax = plt.subplots(figsize=(6, 3.5), dpi=150, facecolor='none')
        # background semicircle
        ax.add_patch(
            patches.Wedge(
                (0.5, 0.4), 0.4, 180, 0,
                facecolor=COLORS["gauge_background"],
                edgecolor='none', zorder=1
            )
        )
        # value wedge
        theta = 180 - (score * 1.8)
        ax.add_patch(
            patches.Wedge(
                (0.5, 0.4), 0.4, 180, theta,
                facecolor=COLORS["primary"],
                edgecolor='none', zorder=2
            )
        )
        # center
        ax.add_patch(patches.Circle((0.5, 0.4), 0.25, color=COLORS["white"], zorder=3))
        ax.text(0.5, 0.4, f"{int(score)}", ha="center", va="center",
                fontsize=34, fontweight='bold', color=COLORS["primary"], zorder=4)
        ax.text(0.5, 0.22, title, ha="center", va="center",
                fontsize=11, color=COLORS["primary"], zorder=4)
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        ax.axis("off")
        fig.patch.set_alpha(0.0)
        plt.tight_layout()
        buf = io.BytesIO()
        fig.savefig(buf, format="png", transparent=True)
        plt.close(fig)
        buf.seek(0)
        return buf
    except Exception:
        return _empty_buffer()

def create_line_chart(entries, title="Trend Over Time"):
    """
    Generic line chart.
    Expects entries with either:
      - {'field': label, 'value': number}
    or
      - {'x': label_or_number, 'y': number}
    """
    try:
        if not entries:
            return _empty_buffer()

        labels = []
        values = []
        for i, e in enumerate(entries):
            if "x" in e and "y" in e:
                labels.append(str(e.get("x")))
                v = e.get("y", 0)
            else:
                labels.append(str(e.get("field", f"{i+1}")))
                v = e.get("value", 0)
            try:
                values.append(float(v))
            except Exception:
                values.append(0.0)

        if not labels:
            return _empty_buffer()

        fig, ax = plt.subplots(figsize=(7, 3.5), dpi=150, facecolor='none')
        x_pos = np.arange(len(labels))

        ax.plot(x_pos, values, marker='o', linewidth=2.0,
                linestyle='-', color=CHART_COLORS[0])

        ax.set_xticks(x_pos)
        ax.set_xticklabels(labels, fontsize=9, color=COLORS["title"], rotation=20)
        ax.set_ylim(0, max(100, max(values) * 1.1 if values else 1))
        ax.set_ylabel("Score", color=COLORS["primary"], fontsize=10)
        ax.set_title(title, fontsize=12, color=COLORS["primary"], pad=8, fontweight='bold')

        ax.grid(axis='y', linestyle='--', linewidth=0.5, color='#E8E4E1')
        ax.tick_params(axis='y', colors=COLORS["subtle_text"])
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)

        fig.patch.set_alpha(0.0)
        plt.tight_layout()
        buf = io.BytesIO()
        fig.savefig(buf, format="png", transparent=True)
        plt.close(fig)
        buf.seek(0)
        return buf
    except Exception:
        return _empty_buffer()

def create_scatter_chart(entries, title="Correlation Map"):
    """
    Scatter chart.
    Expects entries with:
        {'x': number, 'y': number, 'label': optional}
    If 'x' is missing, index is used as x.
    """
    try:
        if not entries:
            return _empty_buffer()

        xs, ys, labels = [], [], []
        for i, e in enumerate(entries):
            x_val = e.get("x", i + 1)
            y_val = e.get("y", e.get("value", 0))
            try:
                xs.append(float(x_val))
            except Exception:
                xs.append(float(i + 1))
            try:
                ys.append(float(y_val))
            except Exception:
                ys.append(0.0)
            labels.append(str(e.get("label", e.get("field", f"P{i+1}"))))

        fig, ax = plt.subplots(figsize=(7, 3.5), dpi=150, facecolor='none')
        sc = ax.scatter(xs, ys, s=40, alpha=0.8, edgecolors='none', c=CHART_COLORS[2])

        for x, y, lbl in zip(xs, ys, labels):
            ax.text(x, y + (max(ys) * 0.01 if ys else 0.3), lbl,
                    fontsize=7, ha='center', color=COLORS["title"])

        ax.set_xlabel("X", color=COLORS["primary"], fontsize=10)
        ax.set_ylabel("Y / Score", color=COLORS["primary"], fontsize=10)
        ax.set_title(title, fontsize=12, color=COLORS["primary"], pad=8, fontweight='bold')
        ax.grid(True, linestyle='--', linewidth=0.5, color='#E8E4E1')
        ax.tick_params(axis='both', colors=COLORS["subtle_text"])
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)

        fig.patch.set_alpha(0.0)
        plt.tight_layout()
        buf = io.BytesIO()
        fig.savefig(buf, format="png", transparent=True)
        plt.close(fig)
        buf.seek(0)
        return buf
    except Exception:
        return _empty_buffer()

# ---------------------------
# Table Helpers (dynamic)
# ---------------------------
def _style_common_table(table, col_widths=None):
    """
    Apply a clean, professional style to tables:
    - Accent header
    - Full subtle grid
    """
    header_bg = colors.HexColor(COLORS["accent"])
    header_text = colors.HexColor(COLORS["primary"])

    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), header_bg),
        ('TEXTCOLOR', (0, 0), (-1, 0), header_text),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),

        ('ALIGN', (0, 0), (-1, 0), 'LEFT'),
        ('VALIGN', (0, 0), (-1, 0), 'MIDDLE'),

        # Body
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('VALIGN', (0, 1), (-1, -1), 'TOP'),

        # Padding
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),

        # Grid
        ('GRID', (0, 0), (-1, -1), 0.3, colors.HexColor(COLORS["grid_lines"])),
    ])
    table.setStyle(style)
    return table

def _create_data_table(data, col_widths=None):
    """data: list of rows (iterable). Returns a ReportLab Table."""
    if not data:
        data = [["Field", "Value"]]

    styles = getSampleStyleSheet()
    body_style = styles['BodyText'] if 'BodyText' in styles else styles['Normal']

    wrapped = [[Paragraph(str(cell), body_style) for cell in row] for row in data]

    # Sensible default widths: use almost full inner width for 2 columns
    if col_widths is None and len(data[0]) == 2:
        inner_width = PAGE_WIDTH - (4.5 * cm)  # approx: left + right margins
        col_widths = [5.5 * cm, inner_width - 5.5 * cm]

    tbl = Table(wrapped, colWidths=col_widths, hAlign='LEFT')
    return _style_common_table(tbl, col_widths)

def _create_guide_table(data):
    """data: list of [Element, Description]"""
    inner_width = PAGE_WIDTH - (4.5 * cm)
    return _create_data_table(data, col_widths=[5.0 * cm, inner_width - 5.0 * cm])

# ---------------------------
# Header/Footer
# ---------------------------
def header_footer(canvas, doc):
    canvas.saveState()
    # Sidebar stripe
    canvas.setFillColor(colors.HexColor(COLORS["sidebar"]))
    canvas.rect(0, 0, 1.5 * cm, PAGE_HEIGHT, fill=1, stroke=0)

    # Vertical company name
    canvas.saveState()
    canvas.translate(1.0 * cm, 8 * cm)
    canvas.rotate(90)
    canvas.setFont("Helvetica-Bold", 12)
    canvas.setFillColor(colors.HexColor(COLORS["white"]))
    canvas.drawString(0, 0, COMPANY_NAME)
    canvas.restoreState()

    # Title top-left
    canvas.setFillColor(colors.HexColor(COLORS["primary"]))
    canvas.setFont("Helvetica-Bold", 10)
    try:
        canvas.drawString(2.5 * cm, PAGE_HEIGHT - 2 * cm, REPORT_TITLE)
    except Exception:
        pass

    # Line below title
    canvas.setStrokeColor(colors.HexColor(COLORS["contrast"]))
    canvas.setLineWidth(1.0)
    canvas.line(2.5 * cm, PAGE_HEIGHT - 2.2 * cm,
                PAGE_WIDTH - 2 * cm, PAGE_HEIGHT - 2.2 * cm)

    # Page number
    canvas.setFont("Helvetica-Bold", 8)
    canvas.setFillColor(colors.HexColor(COLORS["primary"]))
    page_num_text = f"Page {canvas.getPageNumber()}"
    canvas.drawRightString(PAGE_WIDTH - 2 * cm, 1.4 * cm, page_num_text)

    # Footer line & small text
    canvas.setStrokeColor(colors.HexColor(COLORS["contrast"]))
    canvas.setLineWidth(0.8)
    canvas.line(2.5 * cm, 1.8 * cm, PAGE_WIDTH - 2 * cm, 1.8 * cm)
    canvas.setFont("Helvetica-Oblique", 8)
    canvas.setFillColor(colors.HexColor(COLORS["subtle_text"]))
    canvas.drawString(
        2.5 * cm, 1.4 * cm,
        f"We are {COMPANY_NAME} — advancing careers & well-being. | {company_site}"
    )
    canvas.restoreState()

# ---------------------------
# Dynamic guide builder
# ---------------------------
_GUIDE_MAP = {
    "radarChart": [
        ["Axes", "Each axis represents a measured trait."],
        ["Distance from Center", "Higher values are further from center."],
        ["Overall Shape", "Balanced shapes indicate even strengths."],
    ],
    "barChart": [
        ["Bars", "Each bar is a domain (e.g., Study Hours)."],
        ["Length", "Longer bars indicate higher scores."],
        ["Scale", "Scores normalized to the 0–100 range when possible."],
    ],
    "comparisonTable": [
        ["Your Score", "Individual's measured score."],
        ["Benchmark", "Population average used for comparison."],
        ["Gap", "Difference between your score and benchmark."],
    ],
    "donutChart": [
        ["Slices", "Each slice is a life domain."],
        ["Percentage", "Shows proportion of total allocation."],
        ["Balance", "Even slices suggest balanced time allocation."],
    ],
    "gaugeChart": [
        ["Needle Position", "Shows readiness or risk on a 0–100 scale."],
        ["Score", "Numeric summary of the gauge."],
        ["Color Meaning", "Color bands represent ranges of risk/readiness."],
    ],
    "lineChart": [
        ["Points", "Each point is a score at a given stage."],
        ["Trend", "Upward trend indicates growth; downward indicates decline."],
        ["Stability", "Flatter lines show stable traits over time."],
    ],
    "scatterChart": [
        ["Dots", "Each dot represents one measured instance."],
        ["Horizontal Axis", "Often represents one trait or factor."],
        ["Vertical Axis", "Represents another trait or outcome."],
    ],
}

def build_chart_tables(chart_key, chart_data):
    """Return (raw_data_table_rows, guide_table_rows) dynamically from chart data."""
    raw = [["Field", "Value"]]
    # gauge
    if chart_key == "gaugeChart":
        raw.append(["Readiness Score", chart_data.get("value", "N/A")])
    else:
        for row in chart_data.get("data", []):
            # for scatter/line we still show field/x,y/value generically
            if chart_key == "scatterChart" and ("x" in row or "y" in row):
                label = row.get("label", row.get("field", "Point"))
                raw.append([
                    label,
                    f"x: {row.get('x', '—')}, y: {row.get('y', row.get('value', '—'))}"
                ])
            else:
                raw.append([row.get("field", ""), row.get("value", "")])
    guide = [["Element", "Description"]] + _GUIDE_MAP.get(chart_key, [["Info", "No guide available."]])
    return raw, guide

# ---------------------------
# Chart story builder (full detail page)
# ---------------------------
def build_chart_story(title, chart_key, chart_data, chart_buf, styles,
                      img_w_cm=14, img_h_cm=9):
    """
    Creates a KeepTogether story that includes:
      - Title
      - Explanation paragraph
      - Chart image
      - Raw data table
      - How-to-read guide table
    """
    parts = []
    parts.append(Paragraph(title, styles["SectionHeader"]))
    explanation = chart_data.get("explanation", "")
    if explanation:
        parts.append(Paragraph(explanation, styles["Body"]))
    parts.append(Spacer(1, 0.35 * cm))

    # Safe image embedding
    try:
        chart_buf.seek(0)
        parts.append(
            RLImage(
                chart_buf,
                width=img_w_cm * cm,
                height=img_h_cm * cm,
                hAlign='CENTER'
            )
        )
    except Exception:
        parts.append(Paragraph("Chart image unavailable.", styles["Body"]))
    parts.append(Spacer(1, 0.35 * cm))

    # Raw data table
    raw_rows, guide_rows = build_chart_tables(chart_key, chart_data)
    parts.append(Paragraph("Chart Data", styles["TraitTitle"]))
    parts.append(_create_data_table(raw_rows))
    parts.append(Spacer(1, 0.25 * cm))

    # Guide table
    parts.append(Paragraph("How to Read This Chart", styles["TraitTitle"]))
    parts.append(_create_guide_table(guide_rows))
    parts.append(Spacer(1, 0.5 * cm))

    return KeepTogether(parts)

# ---------------------------
# Static pages (overview, how-to-read, score legend)
# ---------------------------
def generate_personality_pdf(filename, data, person_name, generated_by="PsyMitrix"):
    """
    Main function to generate the complete personality report PDF.
    Returns a BytesIO buffer containing the PDF.
    """
    buffer = io.BytesIO()
    global REPORT_TITLE
    REPORT_TITLE = f"Personality Report for {person_name.capitalize()}"

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=2.5 * cm,
        rightMargin=2 * cm,
        topMargin=2.5 * cm,
        bottomMargin=2.5 * cm,
    )

    # Define styles
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name='Justify',
        alignment=0
    ))
    styles.add(ParagraphStyle(
        name='ReportTitle',
        parent=styles['h1'],
        fontSize=24,
        leading=28,
        alignment=1,
        spaceAfter=12,
        textColor=colors.HexColor(COLORS["title"])
    ))
    styles.add(ParagraphStyle(
        name='SectionHeader',
        parent=styles['h2'],
        fontSize=16,
        leading=20,
        spaceBefore=12,
        spaceAfter=8,
        textColor=colors.HexColor(COLORS["primary"])
    ))
    styles.add(ParagraphStyle(
        name='TraitTitle',
        parent=styles['h3'],
        fontSize=12,
        leading=14,
        spaceBefore=8,
        spaceAfter=4,
        textColor=colors.HexColor(COLORS["secondary"])
    ))
    styles.add(ParagraphStyle(
        name='Body',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor(COLORS["body_text"])
    ))
    styles.add(ParagraphStyle(
        name='Small',
        parent=styles['Normal'],
        fontSize=8,
        leading=10,
        textColor=colors.HexColor(COLORS["subtle_text"])
    ))
    styles.add(ParagraphStyle(
        name='CoverTitle',
        parent=styles['h1'],
        fontSize=26,
        leading=30,
        alignment=1,
        textColor=colors.HexColor(COLORS["title"]),
        spaceBefore=8,
        spaceAfter=10
    ))
    styles.add(ParagraphStyle(
        name='CoverSubtitle',
        parent=styles['Normal'],
        fontSize=11,
        leading=14,
        alignment=1,
        textColor=colors.HexColor(COLORS["subtle_text"]),
        spaceAfter=18
    ))
    styles.add(ParagraphStyle(
        name='CoverTagline',
        parent=styles['Normal'],
        fontSize=9,
        leading=11,
        alignment=1,
        textColor=colors.HexColor(COLORS["secondary"]),
        spaceAfter=6
    ))
    styles.add(ParagraphStyle(
        name='Meta',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor(COLORS["body_text"])
    ))

    story = []

    # --- Cover Page (Beautiful First Page) ---
    logo_buf = safe_open_image(COMPANY_LOGO) or make_placeholder_logo()
    logo = RLImage(logo_buf, width=4 * cm, height=4 * cm, hAlign='CENTER')

    story.append(Spacer(1, 1.0 * cm))
    story.append(logo)
    story.append(Spacer(1, 0.5 * cm))
    story.append(Paragraph(COMPANY_NAME, styles['CoverTagline']))

    # Accent band under logo/title
    band_table = Table(
        [[""]],
        colWidths=[PAGE_WIDTH - (doc.leftMargin + doc.rightMargin)],
        rowHeights=[0.5 * cm],
        hAlign='CENTER'
    )
    band_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor(COLORS["accent"])),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor(COLORS["contrast"])),
    ]))
    story.append(Spacer(1, 0.35 * cm))
    story.append(band_table)
    story.append(Spacer(1, 0.7 * cm))

    story.append(Paragraph("Confidential Personality Report", styles['CoverSubtitle']))
    story.append(Paragraph(person_name.capitalize(), styles['CoverTitle']))

    story.append(Spacer(1, 0.3 * cm))
    generated_date = datetime.now().strftime('%B %d, %Y')
    meta_lines = [
        f"Subject: {person_name.capitalize()}",
        f"Date Generated: {generated_date}",
        f"Generated By: {generated_by}",
        f"Contact: {company_info_mail} | {company_site}",
    ]
    for line in meta_lines:
        story.append(Paragraph(line, styles['Meta']))

    story.append(Spacer(1, 1.0 * cm))
    story.append(Paragraph(
        "This report provides a structured view of your personality traits, strengths, and growth areas. "
        "It is intended for personal reflection and professional guidance.",
        styles['Body']
    ))

    story.append(PageBreak())

    # --- Report Sections (Narrative) ---
    report_sections = data.get("sections", {}).get("report", {})
    for title, content in report_sections.items():
        story.append(Paragraph(title, styles['SectionHeader']))
        story.append(Paragraph(content, styles['Body']))
        story.append(Spacer(1, 0.5 * cm))
        
    charts = data.get("sections", {}).get("charts", {})

    # Radar Chart
    if 'radarChart' in charts and charts['radarChart'].get('data'):
        radar_buf = create_radar_chart(charts['radarChart']['data'])
        story.append(PageBreak())
        story.append(build_chart_story("Radar Chart", "radarChart",
                                      charts['radarChart'], radar_buf, styles))

    # Bar Chart (Horizontal)
    if 'barChart' in charts and charts['barChart'].get('data'):
        bar_buf = create_horizontal_bar_chart(charts['barChart']['data'])
        story.append(PageBreak())
        story.append(build_chart_story("Bar Chart", "barChart",
                                      charts['barChart'], bar_buf, styles))

    # Comparison Table (as a chart)
    if 'comparisonTable' in charts and charts['comparisonTable'].get('data'):
        comp_buf = create_comparison_bar_chart(charts['comparisonTable']['data'])
        story.append(PageBreak())
        story.append(build_chart_story("Comparison Chart", "comparisonTable",
                                      charts['comparisonTable'], comp_buf, styles))

    # Donut Chart
    if 'donutChart' in charts and charts['donutChart'].get('data'):
        donut_buf = create_donut_chart(charts['donutChart']['data'])
        story.append(PageBreak())
        story.append(build_chart_story("Donut Chart", "donutChart",
                                      charts['donutChart'], donut_buf, styles,
                                      img_w_cm=12, img_h_cm=12))

    # Gauge Chart
    if 'gaugeChart' in charts and 'value' in charts['gaugeChart']:
        gauge_buf = create_gauge_chart(charts['gaugeChart']['value'])
        story.append(PageBreak())
        story.append(build_chart_story("Gauge Chart", "gaugeChart",
                                      charts['gaugeChart'], gauge_buf, styles,
                                      img_w_cm=12, img_h_cm=7))

    # Line Chart (new)
    if 'lineChart' in charts and charts['lineChart'].get('data'):
        line_buf = create_line_chart(charts['lineChart']['data'])
        story.append(PageBreak())
        story.append(build_chart_story("Trend Line Chart", "lineChart",
                                      charts['lineChart'], line_buf, styles))

    # Scatter Chart (new)
    if 'scatterChart' in charts and charts['scatterChart'].get('data'):
        scatter_buf = create_scatter_chart(charts['scatterChart']['data'])
        story.append(PageBreak())
        story.append(build_chart_story("Scatter / Correlation Chart", "scatterChart",
                                      charts['scatterChart'], scatter_buf, styles))

    # Build PDF
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    buffer.seek(0)
    return buffer
