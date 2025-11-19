```mermaid
erDiagram
    User {
        UUID user_id PK
        string user_type
        string email
        string username
        string hashed_password
        string firstName
        string lastName
        datetime birthdate
        int age
        Gender gender
        string location
        string bio
        string profile_picture_url
        int score
        int interactions
        int streak
        datetime last_interaction
        datetime last_login
        bool is_active
        bool is_verified
        datetime created_at
        datetime updated_at
    }

    Admin {
        UUID admin_id PK
        string user_type
        string email
        string username
        string hashed_password
        AdminRole role
        list_permissions
        string first_name
        string last_name
        bool is_active
        datetime last_login
        datetime created_at
        UUID created_by PK
    }

    Session {
        UUID session_id PK
        datetime session_date
    }

    TestResult {
        string test_name
        int score
    }

    ChatMessage {
        UUID message_id PK
        string sender
        string message
        datetime timestamp
    }

    Games {
        UUID id PK
        datetime played_date
        int total_score
        int games_played
        int total_time_played
    }

    GamesData {
        UUID game_id PK
        string game_name
        int high_score
        int total_score
        datetime last_played
    }

    achievementsData {
        UUID id PK
        string achievement_name
        string description
        datetime date_earned
    }

    MoodTrend {
        UUID mood_id PK
        Mood mood
        datetime created_at
    }

    NotificationData {
        UUID notification_id PK
        string notification_name
        NotificationType type
        datetime date
        string message
        bool seen
        NotificationStatus status
    }

    GoalProgress {
        UUID goal_id PK
        string goal_title
        float target_value
        float current_value
        datetime created_at
        bool is_completed
    }

    HabitTracking {
        UUID habit_id PK
        string habit_name
        string frequency
        int streak_days
        datetime last_completed
    }

    MentalHealthProfile {
        string mental_health_history
        list_therapy_goals
        list_past_diagnoses
        datetime last_assessment_date
    }

    AssessmentResult {
        string assessment_type
        int score
        string severity_level
        datetime date
    }

    WellnessMetric {
        datetime date
        int daily_wellness_score
        int activity_minutes
        float sleep_hours
        int stress_level
    }

    User ||--o{ Session : "has"
    User ||--o{ ChatMessage : "has"
    User ||--o{ Games : "has"
    User ||--o{ achievementsData : "has"
    User ||--o{ MoodTrend : "has"
    User ||--o{ NotificationData : "has"
    User ||--o{ GoalProgress : "has"
    User ||--o{ HabitTracking : "has"
    User ||--o{ MentalHealthProfile : "has"

    Session ||--o{ TestResult : "contains"
    Games ||--o{ GamesData : "details"
    MentalHealthProfile ||--o{ AssessmentResult : "contains"
    MentalHealthProfile ||--o{ WellnessMetric : "tracks"
    Admin }o--|| Admin : "created_by"
```
