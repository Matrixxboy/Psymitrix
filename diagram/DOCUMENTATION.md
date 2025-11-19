# Psymitrix Project Documentation

This document provides a central overview of the Psymitrix project, its development lifecycle, and setup instructions.

---

## 1. Project Overview

### 1.1. Purpose

Psymitrix is a comprehensive mental wellness platform designed to help users gain insights into their mental state through a variety of tools. It combines self-service assessments, AI-driven analytics, cognitive games, and personal tracking to provide a holistic approach to mental well-being.

### 1.2. Key Features

*   **AI-Powered Chat:** An AI companion for users to talk to.
*   **Mental Health Assessments:** Standardized tests (e.g., PHQ-9, GAD-7) to gauge mental state.
*   **Reporting & Analytics:** Generates detailed reports and visualizes trends over time.
*   **Cognitive Games:** Engaging games designed to challenge and improve cognitive functions.
*   **Personal Tracking:** Modules for tracking mood, goals, habits, and other wellness metrics.
*   **Admin Dashboard:** A separate interface for administrators to manage users and view system analytics.

### 1.3. Technology Stack

*   **Frontend:** React.js (with Vite), Tailwind CSS
*   **Backend:** Python with FastAPI
*   **Database:** A combination of a document database (like MongoDB, mimicked by the Pydantic models) and a vector database (ChromaDB) for AI features.

---

## 2. Software Development Life Cycle (SDLC)

### 2.1. Recommended Model: Agile (Kanban)

For a project like Psymitrix, a rigid process like Waterfall is unsuitable. An **Agile methodology** is the "better flow" as it allows for flexibility, rapid iteration, and continuous improvement.

Specifically, **Kanban** is the recommended Agile framework.

*   **Why Kanban?**
    *   **Visual Workflow:** It uses a board to visualize tasks, making it easy to see the status of every feature.
    *   **Continuous Flow:** Unlike Scrum's fixed sprints, Kanban focuses on a continuous flow of work, which is ideal for small teams or individual developers.
    *   **Flexibility:** Priorities can be adjusted in real-time as new insights or user feedback emerge.
    *   **Focus on Finishing:** It encourages finishing tasks before starting new ones, reducing context-switching and improving efficiency.

### 2.2. Proposed Kanban Workflow

This workflow can be managed using tools like Trello, Jira, or GitHub Projects.

**Board Columns:**

1.  **Backlog:** A repository for all ideas, features, and bugs. No prioritization is needed here.
2.  **To Do:** Prioritized tasks ready to be worked on. The team selects tasks from the Backlog to move here.
3.  **In Progress:** The task currently being worked on. It's best to limit the number of items here (e.g., 1-2 per developer).
4.  **In Review:** The work is complete, and a Pull Request (PR) has been opened for code review.
5.  **Done:** The PR has been approved, merged into the `main` branch, and the feature is complete.

**The Flow:**

1.  A new feature idea (e.g., "Add a new cognitive game") is added to the **Backlog**.
2.  During a planning session, the feature is deemed important and moved to **To Do**.
3.  A developer picks the task, creates a new Git branch (e.g., `feature/new-game`), and moves the card to **In Progress**.
4.  Once development is complete, the developer opens a Pull Request to merge their branch into `main`. The card is moved to **In Review**.
5.  Another team member reviews the code, provides feedback, and eventually approves it.
6.  The PR is merged. The card is moved to **Done**.

---

## 3. Local Development Setup

### 3.1. Prerequisites

*   Node.js and npm
*   Python 3.8+ and pip

### 3.2. Backend Setup

1.  **Navigate to the Server Directory:**
    ```bash
    cd Server
    ```
2.  **Create and Activate a Virtual Environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```
3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Run the Backend Server:**
    ```bash
    uvicorn app:app --reload
    ```
    The backend will be running at `http://127.0.0.1:8000`.

### 3.3. Frontend Setup

1.  **Navigate to the Project Root Directory.**
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Run the Frontend Development Server:**
    ```bash
    npm run dev
    ```
    The frontend will be accessible at `http://localhost:5173` (or another port if 5173 is busy).

### 3.4. Environment Variables

Create a `.env` file in the project's root directory and a `Server/.env` for the backend. These files are needed to store sensitive information.

**Example for `Server/.env`:**
```
DATABASE_URL="your_database_connection_string"
SECRET_KEY="a_very_secret_key_for_jwt"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```
