import os
from openai import OpenAI 
from fastapi import HTTPException
from collections import defaultdict
from models.user_model import User

# Prompts for different report types
PROMPTS = {
    "personality_traits": """
You are an expert Psychologist and Behavioural Analyst.

Generate a ~400-word Personality Report in pure JSON using the inputs below.

Focus only on behavioral insights — do not reference or mention any psychological theories or models. Maintain a professional, neutral, and human-readable tone. The output must be valid JSON only (no markdown or additional text).

Inputs:
- Name: {Name}
- Gender: {Gender}
- DOB: {DOB}
- Blood Group: {Blood_Group}
- Older Siblings: {Older_Siblings}
- Younger Siblings: {Younger_Siblings}

consider this structure and keys must be followed:
{
  "sections": {
    "report": {
      "Openness": "...",
      "Individualization": "...",
      "Introversion–Extraversion": "...",
      "Self-Esteem": "...",
      "Enneagram & DISC Summary": "...",
      "FIRO-B Summary": "...",
      "Career Fit": "...",
      "Neuro Map": "..."
    },
    "charts": {
      "radarChart": {
        "data": [
          { "field": "Openness", "value": "80" },
          { "field": "Conscientiousness", "value": "60" },
          { "field": "Extraversion", "value": "45" },
          { "field": "Agreeableness", "value": "70" },
          { "field": "Neuroticism", "value": "30" }
        ],
        "explanation": "This chart maps your core personality traits."
      },
      "barChart": {
        "data": [
          { "field": "Career Fit", "value": "85" },
          { "field": "Leadership", "value": "75" },
          { "field": "Teamwork", "value": "90" }
        ],
        "explanation": "This chart shows your professional strengths."
      },
      "comparisonTable": {
        "data": [
          { "field": "Emotional Stability", "value": "65" },
          { "field": "Self-Control", "value": "55" }
        ],
        "explanation": "This compares your scores to a benchmark."
      },
      "donutChart": {
        "data": [
          { "field": "Social", "value": "40" },
          { "field": "Work", "value": "35" },
          { "field": "Personal", "value": "25" }
        ],
        "explanation": "This shows the distribution of your life focus."
      },
      "gaugeChart": {
        "value": "75",
        "explanation": "This gauge indicates your overall wellness score."
      }
    }
  }
}
""",
    "mental_health_insights": """
You are a clinical psychologist. Generate a Mental Health Insights report in JSON format.
Analyze the provided user data to create a report focusing on mood trends, anxiety levels, and potential depression indicators.
The output must be valid JSON only.

Inputs:
- Name: {Name}
- Recent Moods: {Recent_Moods}
- Average Sleep Hours: {Avg_Sleep_Hours}
- PHQ-9 Score: {PHQ9_Score}
- GAD-7 Score: {GAD7_Score}

Generate a report with the following structure:
{
  "sections": {
    "report": {
      "Overall Summary": "A summary of mental health based on the data.",
      "Mood Analysis": "Detailed analysis of mood patterns.",
      "Anxiety & Depression Levels": "Insights on anxiety and depression scores.",
      "Recommendations": "Actionable recommendations for mental wellness."
    },
    "charts": {
      "radarChart": {
        "data": [
          { "field": "Mood Stability", "value": "60" },
          { "field": "Anxiety Level", "value": "40" },
          { "field": "Depression Score", "value": "30" },
          { "field": "Sleep Quality", "value": "50" },
          { "field": "Stress Resilience", "value": "70" }
        ],
        "explanation": "Explain the chart with current mental health indicators with two to four lines."
      },
      "barChart": {
        "data": [
          { "field": "PHQ-9", "value": "{PHQ9_Score}" },
          { "field": "GAD-7", "value": "{GAD7_Score}" }
        ],
        "explanation": "Your recent assessment scores for depression (PHQ-9) and anxiety (GAD-7)."
      },
      "comparisonTable": {
        "data": [],
        "explanation": ""
      },
      "donutChart": {
        "data": [],
        "explanation": ""
      },
      "gaugeChart": {
        "value": "65",
        "explanation": "This gauge represents your overall mental wellness score for the selected period."
      }
    }
  }
}
""",
    "weekly_progress_summary": """
You are a wellness coach. Generate a Weekly Progress Summary report in JSON format.
Summarize the user's activities, achievements, and progress over the last week.
The output must be valid JSON only.

Inputs:
- Name: {Name}
- Journal Entries This Week: {Journal_Entries}
- Mood Trend: {Mood_Trend}
- Completed Goals: {Completed_Goals}
- Streak: {Streak}

Generate a report with the following structure:
{
  "sections": {
    "report": {
      "Weekly Overview": "An overview of the user's week.",
      "Key Achievements": "Highlighting positive accomplishments.",
      "Areas for Improvement": "Suggestions for the upcoming week.",
      "Goals for Next Week": "Setting new goals for continued growth."
    },
    "charts": {
      "radarChart": {
        "data": [],
        "explanation": ""
      },
      "barChart": {
        "data": [
          { "field": "Journals", "value": "{Journal_Entries}" },
          { "field": "Goals Met", "value": "{Completed_Goals}" },
          { "field": "Streak", "value": "{Streak}" }
        ],
        "explanation": "Your activity and engagement for the past week."
      },
      "comparisonTable": {
        "data": [],
        "explanation": ""
      },
      "donutChart": {
        "data": [],
        "explanation": ""
      },
      "gaugeChart": {
        "value": "80",
        "explanation": "Your progress score for the week based on your activities."
      }
    }
  }
}
""",
    "full_wellness_profile": """
You are a holistic health expert. Generate a Full Wellness Profile in JSON format.
Create a comprehensive report covering all aspects of the user's wellness, including mental, emotional, and lifestyle factors.
The output must be valid JSON only.

Inputs:
- All user data: {All_Data}

Generate a report with the following structure:
{
  "sections": {
    "report": {
      "Holistic Health Summary": "A complete summary of the user's wellness.",
      "Mental & Emotional State": "In-depth analysis of psychological well-being.",
      "Lifestyle & Habits": "Review of daily routines, sleep, and other lifestyle factors.",
      "Strengths & Growth Areas": "Identifying key strengths and areas for development.",
      "Long-term Recommendations": "Comprehensive recommendations for a balanced life."
    },
    "charts": {
      "radarChart": {
        "data": [
          { "field": "Mental", "value": "75" },
          { "field": "Emotional", "value": "65" },
          { "field": "Physical", "value": "50" },
          { "field": "Social", "value": "80" },
          { "field": "Spiritual", "value": "60" }
        ],
        "explanation": "A holistic view of your wellness across different life dimensions."
      },
      "barChart": {
        "data": [
            { "field": "Stress", "value": "40" },
            { "field": "Happiness", "value": "70" },
            { "field": "Productivity", "value": "80" }
        ],
        "explanation": "Key indicators of your overall well-being."
      },
      "comparisonTable": {
        "data": [],
        "explanation": ""
      },
      "donutChart": {
        "data": [],
        "explanation": ""
      },
      "gaugeChart": {
        "value": "70",
        "explanation": "Your comprehensive wellness score."
      }
    }
  }
}
"""
}

async def generate_report(params: User, report_type: str) -> str:
    groq_api_key = os.getenv("GROQ_API")
    if not groq_api_key:
        raise ValueError("❌ GROQ_API environment variable not found.")

    userFirstName = params.firstName or ""
    userLastName = params.lastName or ""
    userFullName = f"{userFirstName} {userLastName}".strip()
    
    # Prepare data based on report type
    data = {"Name": userFullName or "N/A"}
    if report_type == "personality_traits":
        data.update({
            "Gender": params.gender or "N/A",
            "DOB": str(params.birthdate) or "N/A",
            "Relationship_Status": params.relationshipStatus or "N/A",
            "Children": str(params.childrens) or "N/A",
            "Occupation": params.occupation or "N/A",
            "Younger_Siblings": str(params.youngerSiblings) or "N/A",
            "Older_Siblings": str(params.olderSiblings) or "N/A",
            "Blood_Group": params.bloodgroup or "N/A",
        })
    elif report_type == "mental_health_insights":
        # These would ideally be calculated from user data
        data.update({
            "Recent_Moods": "Mixed", 
            "Avg_Sleep_Hours": "6.5",
            "PHQ9_Score": "12",
            "GAD7_Score": "9"
        })
    elif report_type == "weekly_progress_summary":
        data.update({
            "Journal_Entries": "3",
            "Mood_Trend": "Improving",
            "Completed_Goals": "2",
            "Streak": str(params.streak or 0)
        })
    elif report_type == "full_wellness_profile":
        # For a full profile, you might serialize more of the user model
        data.update({
            "All_Data": params.model_dump_json(indent=2)
        })

    report_prompt = PROMPTS.get(report_type)
    if not report_prompt:
        raise HTTPException(status_code=400, detail=f"Invalid report type: {report_type}")

    # Escape all literal curly braces before formatting
    escaped_prompt = report_prompt.replace("{", "{{").replace("}", "}}")

    # Then reinsert only the placeholders we actually want to fill
    for key in data.keys():
        escaped_prompt = escaped_prompt.replace(f"{{{{{key}}}}}", f"{{{key}}}")

    safe_data = defaultdict(lambda: "N/A", data)
    dynamic_prompt = escaped_prompt.format_map(safe_data)

    try:
        client = OpenAI(
            api_key=groq_api_key,
            base_url="https://api.groq.com/openai/v1"
        )

        ai_response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": "You are an empathetic psychiatrist generating intake questions."},
                {"role": "user", "content": dynamic_prompt}
            ],
        )
        response_text = ai_response.choices[0].message.content
        return response_text

    except Exception as e:
        print(f"🚨 Error during LLM API call: {e}")
        raise HTTPException(status_code=500, detail=str(e))
