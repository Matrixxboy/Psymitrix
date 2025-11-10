export const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 12
      ? "Good morning"
      : hour < 17
      ? "Good afternoon"
      : "Good evening";
  };
  
  export const getMoodScore = (mood) => {
    const moodScores = {
      'excited': 10,
      'happy': 8,
      'calm': 7,
      'neutral': 5,
      'sad': 3,
      'angry': 2
    };
    return moodScores[mood] || 5;
  };
  
  export const filterDataByTimeframe = (data, timeframe = 'month') => {
    if (!data || data.length === 0) return [];
    
    const now = new Date();
    let cutoffDate;
    
    if (timeframe === 'week') {
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeframe === 'year') {
      cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    } else {
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  
    return data.filter(item => {
      try {
        const itemDate = new Date(item.created_at);
        return itemDate >= cutoffDate;
      } catch {
        return true;
      }
    });
  };

  export const filterSleepDataByTimeframe = (metrics, timeframe) => {
    const filtered = filterDataByTimeframe(metrics, timeframe);
    return filtered.filter(metric => metric.sleep_hours !== undefined && metric.sleep_hours !== null);
  };
  
  export const processMoodTrendsData = (moodTrends, timeframe = 'month') => {
    const filteredMoods = filterDataByTimeframe(moodTrends, timeframe);
    
    if (filteredMoods.length === 0) {
      return { labels: [], values: [] };
    }
  
    const labels = filteredMoods.map(trend => {
      const date = new Date(trend.created_at);
      if (timeframe === 'week') {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      } else if (timeframe === 'month') {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      }
    });
  
    const values = filteredMoods.map(trend => getMoodScore(trend.mood));
  
    return { labels, values };
  };
  
  export const calculateWellnessBalance = (user) => {
    if (!user?.mental_health_profile?.assessment_results || user.mental_health_profile.assessment_results.length === 0) {
      return {
        labels: ["Stress", "Sleep", "Mood", "Energy", "Focus"],
        datasets: [
          {
            label: "This Week",
            data: [5, 5, 5, 5, 5]
          },
          {
            label: "Last Week",
            data: [5, 5, 5, 5, 5]
          }
        ]
      };
    }
  
    // Calculate based on assessment data
    const recentAssessments = filterDataByTimeframe(user.mental_health_profile.assessment_results, 'month');
    
    let stressScore = 5;
    let moodScore = 5;
    let focusScore = 5;
  
    if (recentAssessments.length > 0) {
      const latestGAD7 = recentAssessments.find(a => a.assessment_type === 'GAD-7');
      const latestPHQ9 = recentAssessments.find(a => a.assessment_type === 'PHQ-9');
  
      // GAD7 (anxiety/stress) - convert score to 1-10 scale (lower is better)
      if (latestGAD7) {
        stressScore = 10 - Math.min(latestGAD7.score, 9);
      }
  
      // PHQ9 - affects mood score
      if (latestPHQ9) {
        moodScore = 10 - Math.min(latestPHQ9.score, 9);
      }
  
      focusScore = moodScore; // Correlation between mood and focus
    }
  
    // Get sleep and activity from wellness metrics
    let sleepScore = 5;
    let energyScore = 5;
  
    if (user.mental_health_profile?.wellness_metrics && user.mental_health_profile.wellness_metrics.length > 0) {
      const latestMetric = user.mental_health_profile.wellness_metrics[user.mental_health_profile.wellness_metrics.length - 1];
      
      if (latestMetric.sleep_hours) {
        // 7-9 hours is optimal (score 10)
        sleepScore = Math.max(1, Math.min(10, Math.round((latestMetric.sleep_hours / 8) * 10)));
      }
  
      if (latestMetric.daily_wellness_score) {
        energyScore = Math.round((latestMetric.daily_wellness_score || 0) / 10);
      }
    }
  
    return {
      labels: ["Stress", "Sleep", "Mood", "Energy", "Focus"],
      datasets: [
        {
          label: "Current",
          data: [10 - stressScore, sleepScore, moodScore, energyScore, focusScore]
        },
        {
          label: "Average",
          data: [5, 5, 5, 5, 5]
        }
      ]
    };
  };
  
  export const calculateActivityBreakdown = (user) => {
    if (!user?.games || user.games.length === 0) {
      return {
        value: 0,
        label: "No activities yet"
      };
    }
  
    const totalGameTime = user.games.reduce((sum, game) => sum + (game.total_time_played || 0), 0);
    const weeklyGoal = 150; // minutes per week
    const percentage = Math.min(100, Math.round((totalGameTime / weeklyGoal) * 100));
  
    return {
      value: percentage,
      label: `${percentage}% of weekly goal (${totalGameTime}min)`
    };
  };
  
  export const generateConsistencyData = (moodTrends) => {
    // Generate heatmap data from mood trends
    if (!moodTrends || moodTrends.length === 0) {
      return [];
    }
  
    const data = [];
    const now = new Date();
  
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
  
      const moodForDay = moodTrends.find(m => {
        const moodDate = new Date(m.created_at).toISOString().split('T')[0];
        return moodDate === dateStr;
      });
  
      // If there's a mood entry, value is 0.8 (tracked), otherwise 0.3 (not tracked)
      data.push({
        date: dateStr,
        value: moodForDay ? 0.8 : 0.3
      });
    }
  
    return data;
  };