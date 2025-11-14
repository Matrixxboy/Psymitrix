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