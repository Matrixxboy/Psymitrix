import os
from openai import OpenAI 
from fastapi import HTTPException
from collections import defaultdict
from models.user_model import User

report_prompt = """
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

Sections (in order):
1. Openness
2. Individualization
3. Introversion–Extraversion
4. Self-Esteem
5. Enneagram & DISC Summary
6. FIRO-B Summary
7. Career Fit
8. Neuro Map
9. Radar Chart data with only: "fields", "values" in numbers, and "explanation" a complete chart 
10. Bar Chart data with only: "fields", "values" in numbers, and "explanation" a complete chart
11. Comparison Table data with only: "fields", "values" in numbers, and "explanation" a complete chart
12. Donut Chart data with only: "fields", "values" in numbers, and "explanation" a complete chart
13. Gauge Chart data with only: "value" in numbers, and "explanation" a complete chart

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
          {
            "field": "...",
            "value": "..."
          }
        ],
        "explanation": "Complete explanation of the radar chart"
      },
      "barChart": {
        "data": [
          {
            "field": "...",
            "value": "..."
          }
        ],
        "explanation": "Complete explanation of the bar chart"
      },
      "comparisonTable": {
        "data": [
          {
            "field": "...",
            "value": "..."
          }
        ],
        "explanation": "Complete explanation of the comparison table"
      },
      "donutChart": {
        "data": [
          {
            "field": "...",
            "value": "..."
          }
        ],
        "explanation": "Complete explanation of the donut chart"
      },
      "gaugeChart": {
        "value": "...",
        "explanation": "Complete explanation of the gauge chart"
      }
    }
  }
}
"""

async def generate_report(params: User ) -> str:
    groq_api_key = os.getenv("GROQ_API")
    if not groq_api_key:
        raise ValueError("❌ GROQ_API environment variable not found.")

    userFirstName = params.firstName or ""
    userLastName = params.lastName or ""
    userFullName = f"{userFirstName} {userLastName}".strip()
    
    data = {
        "Name": userFullName or "N/A",
        "Gender": params.gender or "N/A",
        "DOB": str(params.birthdate) or "N/A",
        "Relationship_Status": params.relationshipStatus or "N/A",
        "Children": str(params.childrens) or "N/A",
        "Occupation": params.occupation or "N/A",
        "Younger_Siblings": str(params.youngerSiblings) or "N/A",
        "Older_Siblings": str(params.olderSiblings) or "N/A",
        "Blood_Group": params.bloodgroup or "N/A",
    }

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
