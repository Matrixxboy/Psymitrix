# 🚀 Quick Start Guide - PsyMitrix

## ✨ What's New

Your mental health application now includes:

1. **AI Psychiatrist Chat** (`/chat`)
   - Real-time conversations with an AI powered by Mistral-7B
   - Context-aware responses based on your mental health profile
   - Crisis detection for urgent situations

2. **Mental Health Assessments** (`/assessments`)
   - PHQ-9: Depression screening (9 questions)
   - GAD-7: Anxiety screening (7 questions)
   - Instant scoring and severity assessment
   - Personalized recommendations

3. **Comprehensive Reports** (`/reports`)
   - PDF generation with graphs and charts
   - Assessment trends analysis
   - Research-based personality insights:
     - Birth season characteristics
     - Blood type personality theory
     - Birth order analysis
   - Downloadable professional reports

4. **Enhanced Dashboard** (`/dashboard`)
   - Quick-access cards for all new features
   - Mood tracking visualization
   - Engagement statistics

---

## 🎯 How to Use

### **Step 1: Login/Register**
- Navigate to `/login`
- Use existing credentials or create a new account

### **Step 2: Dashboard**
- You'll be taken to `/dashboard`
- See quick-access cards for Chat, Assessments, and Reports
- Click any card to navigate to that feature

### **Step 3: Try AI Chat**
- Go to `/chat`
- Type your message in the input field
- AI responds with supportive, evidence-based guidance
- Your conversation is saved automatically

### **Step 4: Complete Assessments**
- Go to `/assessments`
- Select PHQ-9 (depression) or GAD-7 (anxiety)
- Rate each item from 0-3
- Get instant results with severity level and recommendations

### **Step 5: View Your Report**
- Go to `/reports`
- Click "Generate Report" to create a comprehensive PDF
- View detailed analysis including:
  - Assessment trends
  - Mood patterns
  - Research-based insights
- Download PDF for personal records

---

## 🔧 Backend Setup (Important!)

The backend now requires additional dependencies. These have been added to `Server/requirements.txt`:

**Key new packages:**
- `langchain` - LLM orchestration
- `chromadb` - Vector database
- `huggingface-hub` - Model API
- `transformers` - Pre-trained models
- `reportlab` - PDF generation
- `matplotlib` - Data visualization

**Installation:**
```bash
cd Server
pip install -r requirements.txt
```

**Note**: The HuggingFace API token is pre-configured in the code:
```
HF_API_TOKEN=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
```

---

## 📱 Navigation Updates

All pages are now accessible from the main navigation:

**Desktop Navigation:**
- Dashboard → Chat → Assessments → Games → Progress → **Reports** ← NEW → Profile

**Mobile Menu:**
- Same links, responsive on all screen sizes

---

## 🎨 UI Features

### **Calming Design**
- Warm color palette (browns, terracotta, creams)
- Smooth animations and transitions
- Glass-morphism cards for a modern, soft look
- Dark mode support

### **Responsive Design**
- Mobile-first approach
- Tablet-optimized layouts
- Desktop with optimal column distribution

### **Accessibility**
- Clear call-to-action buttons
- Progress indicators for assessments
- Error messages and confirmations
- Loading states

---

## 🤖 AI Features Explained

### **How the AI Responds**
1. You send a message
2. AI analyzes your message content
3. AI considers your:
   - Mental health history
   - Recent mood trends
   - Previous assessment scores
   - Demographics
4. AI retrieves relevant mental health knowledge
5. AI generates supportive, personalized response
6. Response is saved to your conversation history

### **Safety Features**
- Crisis detection for keywords like "suicide," "self-harm"
- Severity level analysis
- Resource recommendations for critical situations
- Professional help guidance for severe conditions

---

## 📊 Assessment Scoring

### **PHQ-9 (Depression)**
```
0-4:     Minimal depression
5-9:     Mild depression
10-14:   Moderate depression
15-19:   Moderately severe
20-27:   Severe depression
```

### **GAD-7 (Anxiety)**
```
0-4:     Minimal anxiety
5-9:     Mild anxiety
10-14:   Moderate anxiety
15-20:   Moderately severe
21+:     Severe anxiety
```

---

## 📈 Report Contents

Your generated report includes:

1. **User Information Summary**
   - Name, age, occupation, location
   - Member since date

2. **Assessment Summary**
   - Latest scores for PHQ-9 and GAD-7
   - Trend indicators (improving/declining/stable)
   - Average scores

3. **Mood Trends**
   - Most common mood
   - Mood distribution chart
   - 30-day trend analysis

4. **Research-Based Insights**
   - Birth season personality profile
   - Blood type characteristics
   - Birth order psychology
   - Strengths and growth areas

5. **Recommendations**
   - Personalized suggestions based on scores
   - Resources for mental health support
   - Therapeutic techniques
   - When to seek professional help

---

## 🐛 Troubleshooting

### **Chat Not Working?**
- Ensure backend is running: `uvicorn app:app --reload` (from Server folder)
- Check HuggingFace API token is valid
- Try refreshing the page

### **Assessments Not Loading?**
- Clear browser cache
- Ensure you're logged in
- Check network tab for API errors

### **Report Generation Failing?**
- Ensure you have completed at least one assessment
- Check available disk space for PDF
- Try generating without advanced options first

### **Backend Dependencies Not Installing?**
```bash
pip install --upgrade pip
pip install -r requirements.txt --no-cache-dir
```

---

## 🔑 Key Files Created/Modified

### **New Backend Files**
- `Server/apis/ai_chat/` - AI chat API
- `Server/apis/assessments/` - Assessment APIs
- `Server/apis/mental_health_reports/` - Report generation
- `Server/models/user_model.py` - Updated user model

### **New Frontend Files**
- `src/pages/Chat/ChatPage.jsx` - Chat interface
- `src/pages/Assessments/AssessmentsPage.jsx` - Assessments
- `src/pages/Reports/ReportsPage.jsx` - Reports dashboard
- `src/api/ai_chat.js` - Chat API client
- `src/api/assessments.js` - Assessment API client
- `src/api/reports.js` - Report API client

### **Modified Files**
- `Server/app.py` - Added new routers
- `Server/requirements.txt` - Added dependencies
- `src/routes/AppRoutes.jsx` - Added new routes
- `src/components/layout/Layout.jsx` - Added navigation links
- `src/pages/Dashboard/sections/PrimaryCTA.jsx` - Enhanced with new cards

---

## 📚 Documentation

For detailed information, see:
- `IMPLEMENTATION_GUIDE.md` - Complete technical documentation
- `README.md` - Original project information

---

## 🎯 Next Steps

1. **Test All Features**
   ```bash
   1. Login to the app
   2. Visit /chat and try asking questions
   3. Go to /assessments and complete PHQ-9
   4. Generate a report at /reports
   ```

2. **Verify Backend APIs**
   ```bash
   # Backend should be running
   curl http://localhost:8000/api/v1/assessments/phq9/questions
   ```

3. **Check Database**
   - Ensure MongoDB has user data
   - Verify assessment results are being saved

4. **Customize**
   - Update mental health knowledge in Chroma vector store
   - Modify assessment questions if needed
   - Customize report templates
   - Adjust AI personality/tone

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Test all features locally
- [ ] Set up environment variables securely
- [ ] Configure MongoDB for production
- [ ] Set up proper CORS for your domain
- [ ] Configure HuggingFace API rate limits
- [ ] Set up error logging/monitoring
- [ ] Configure backup for user data
- [ ] Test on mobile devices
- [ ] Set up SSL certificate
- [ ] Create user documentation

---

## 💡 Tips for Best Results

1. **AI Chat**
   - Be specific about your concerns
   - Provide context about your situation
   - Ask follow-up questions

2. **Assessments**
   - Answer honestly for accurate results
   - Take them regularly (weekly/monthly)
   - Track trends over time

3. **Reports**
   - Generate monthly for tracking progress
   - Share with healthcare providers if needed
   - Use insights for personal development

---

## 🎓 Learn More

- LangChain: https://python.langchain.com/
- HuggingFace: https://huggingface.co/
- ReportLab: https://www.reportlab.com/
- PHQ-9: https://www.phqscreeners.com/
- GAD-7: https://www.phqscreeners.com/

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review IMPLEMENTATION_GUIDE.md
3. Check browser console for errors
4. Check backend logs for API errors

---

**You're all set! Start using PsyMitrix's AI psychiatrist today! 🎉**
