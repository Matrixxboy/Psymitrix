# Psymitrix Data Dictionary

This document provides a dictionary for the main data entities used in the Psymitrix application. It is based on the Pydantic models in `Server/models/`.

---

## 1. User Entity

This is the central entity representing an application user.

| Field Name | Data Type | Description | Constraints / Notes |
| :--- | :--- | :--- | :--- |
| `user_id` | `UUID` | Unique identifier for the user. | **Primary Key** |
| `user_type` | `str` | The type of user, hardcoded to "user". | Default: "user" |
| `email` | `EmailStr` | User's email address. | Required, Must be a valid email format. |
| `username` | `str` | User's chosen username. | Required |
| `hashed_password` | `str` | The hashed version of the user's password. | Required |
| `firstName` | `str` | User's first name. | Optional |
| `lastName` | `str` | User's last name. | Optional |
| `birthdate` | `datetime` | User's date of birth. | Optional |
| `age` | `PositiveInt` | User's age. | Optional, Must be a positive integer. |
| `gender` | `Enum` | User's gender (`male`, `female`, `other`, etc.). | Optional |
| `score` | `int` | Gamification score for the user. | Default: 0 |
| `streak` | `PositiveInt` | Current daily interaction streak. | Default: 0 |
| `is_active` | `bool` | Flag indicating if the account is active. | Default: `true` |
| `is_verified` | `bool` | Flag indicating if the user's email is verified. | Default: `false` |
| `created_at` | `datetime` | Timestamp when the user account was created. | Auto-generated on creation. |
| `updated_at` | `datetime` | Timestamp of the last update to the user profile. | Auto-generated on update. |
| `sessions` | `List[Session]` | List of user sessions containing test results. | See `Session` entity. |
| `mood_trends` | `List[MoodTrend]` | List of mood entries recorded by the user. | See `MoodTrend` entity. |
| `goals_progress`| `List[GoalProgress]`| List of goals set by the user. | See `GoalProgress` entity. |
| `mental_health_profile` | `MentalHealthProfile` | Detailed profile of the user's mental health. | See `MentalHealthProfile` entity. |

---

## 2. Admin Entity

Represents an administrator with elevated privileges.

| Field Name | Data Type | Description | Constraints / Notes |
| :--- | :--- | :--- | :--- |
| `admin_id` | `UUID` | Unique identifier for the admin. | **Primary Key** |
| `email` | `EmailStr` | Admin's email address. | Required |
| `username` | `str` | Admin's username. | Required |
| `hashed_password` | `str` | The hashed version of the admin's password. | Required |
| `role` | `Enum` | Role of the admin (`super_admin`, `admin`, etc.). | Required |
| `permissions` | `List[Enum]` | List of specific permissions granted to the admin. | e.g., `manage_users` |
| `is_active` | `bool` | Flag indicating if the admin account is active. | Default: `true` |
| `created_at` | `datetime` | Timestamp when the admin account was created. | Auto-generated. |
| `created_by` | `UUID` | The `admin_id` of the admin who created this account. | Optional, Foreign Key (self-referential) |

---

## 3. MoodTrend Entity

Represents a single mood entry by a user.

| Field Name | Data Type | Description | Constraints / Notes |
| :--- | :--- | :--- | :--- |
| `mood_id` | `UUID` | Unique identifier for the mood entry. | **Primary Key** |
| `mood` | `Enum` | The mood recorded by the user (`happy`, `sad`, etc.). | Required |
| `created_at` | `datetime` | Timestamp when the mood was recorded. | Auto-generated. |

---

## 4. GoalProgress Entity

Represents a single goal a user is tracking.

| Field Name | Data Type | Description | Constraints / Notes |
| :--- | :--- | :--- | :--- |
| `goal_id` | `UUID` | Unique identifier for the goal. | **Primary Key** |
| `goal_title` | `str` | The title or name of the goal. | Required |
| `target_value` | `float` | The target value for the goal. | Required |
| `current_value` | `float` | The current value or progress. | Default: 0.0 |
| `is_completed` | `bool` | Flag indicating if the goal has been completed. | Default: `false` |
| `created_at` | `datetime` | Timestamp when the goal was created. | Auto-generated. |

---

## 5. AssessmentResult Entity

Represents the result of a single mental health assessment (part of `MentalHealthProfile`).

| Field Name | Data Type | Description | Constraints / Notes |
| :--- | :--- | :--- | :--- |
| `assessment_type` | `str` | The type of assessment taken (e.g., 'PHQ-9'). | Required |
| `score` | `int` | The calculated score for the assessment. | Required |
| `severity_level` | `str` | The interpretation of the score (e.g., 'mild'). | Required |
| `date` | `datetime` | Timestamp when the assessment was completed. | Auto-generated. |
