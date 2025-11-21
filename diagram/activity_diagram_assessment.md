https://app.diagrams.net/
https://plantuml.com/
```
@startuml
title Application Navigation – Compact User ↔ System Flow (A4 Friendly)

'--- Lanes ---
|User|
start
:Open Application;
--> System

|System|
if (Is User Authenticated?) then (Yes)
    --> User
else (No)
    :Redirect to Login Page;
    stop
endif

|User|
:Choose a Page;
note right
Available Pages:
- Dashboard
- Progress
- AI Chat
- Reports
- Games
- Profile
- Assessments
end note
--> System

|System|
:Load Selected Page Data;
note right
System loads only what is needed
for the selected page
(Dashboard, Progress, Chat, etc.)
end note
--> User

|User|
:Perform Page Actions;
repeat
:Navigate to Another Page?;
repeat while (Yes)

|User|
stop

@enduml
```
