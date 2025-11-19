# Project Requirements

This document outlines the hardware and software requirements for the Psymitrix project, covering both development and production environments.

---

## 1. Development Environment Requirements

This section describes the necessary setup for a developer to run, test, and contribute to the project.

### 1.1. Hardware Requirements (Development)

The requirements are typical for modern web development.

| Component | Minimum | Recommended | Notes |
| :--- | :--- | :--- | :--- |
| **CPU** | Dual-Core 2.0 GHz | Quad-Core 2.4 GHz+ | Intel Core i5/i7, AMD Ryzen 5/7, or Apple M-series. |
| **RAM** | 8 GB | 16 GB or more | Needed to comfortably run the frontend server, backend server, database, code editor, and browser simultaneously. |
| **Storage** | 20 GB free space | 50 GB+ free SSD space | An SSD is highly recommended for faster build times and dependency installation. |
| **Display** | 1920x1080 | 1920x1080 or higher | Standard resolution for modern UI development. |

### 1.2. Software Requirements (Development)

| Software | Version | Notes |
| :--- | :--- | :--- |
| **Operating System** | Windows 10+, macOS 11+, Linux | Any modern OS with a graphical user interface. |
| **Node.js** | 18.x LTS or newer | JavaScript runtime for the frontend. |
| **npm** | 9.x or newer | Comes bundled with Node.js. |
| **Python** | 3.8 - 3.11 | Programming language for the backend. |
| **pip** | 22.x or newer | Python package manager, comes with Python. |
| **Git** | 2.3x or newer | For version control. |
| **Web Browser** | Latest Chrome, Firefox, or Edge | For testing and debugging the application. |
| **Code Editor** | VS Code, PyCharm, WebStorm, etc. | An IDE or editor with support for Python and JavaScript/React. |

---

## 2. Production Environment Requirements

This section describes a typical setup for hosting the live application for end-users. These are estimates and scale with user traffic.

### 2.1. Hardware Requirements (Production)

This typically translates to a cloud provider's instance size (e.g., AWS EC2, DigitalOcean Droplet).

| Service | CPU (vCPU) | RAM | Storage | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Backend Server** | 2+ Cores | 4 GB+ | 50 GB+ SSD | Scales with concurrent users and background tasks. |
| **Database Server** | 2+ Cores | 4 GB+ | 100 GB+ SSD | Highly dependent on data volume. Using a managed service (e.g., MongoDB Atlas) is recommended. |
| **Frontend Hosting**| N/A | N/A | N/A | The React frontend is a static build and can be served from a CDN or static hosting provider (e.g., Vercel, Netlify), which abstracts hardware needs. |

### 2.2. Software Requirements (Production)

| Software | Purpose | Notes |
| :--- | :--- | :--- |
| **Operating System** | Linux (e.g., Ubuntu 22.04 LTS) | Standard for web servers due to stability and performance. |
| **Web Server** | Nginx or similar | Acts as a reverse proxy, handles SSL, and serves static files. |
| **ASGI Server** | Gunicorn with Uvicorn workers | A production-grade server to run the Python FastAPI application. |
| **Database** | MongoDB, PostgreSQL, or other | The production database server. |
| **Python** | 3.8 - 3.11 | To run the backend application. |
| **Process Manager** | `systemd` or `supervisor` | To ensure the backend application runs continuously as a service. |
