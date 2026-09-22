# Hostel Complaint Register

A small dynamic web application for registering and tracking hostel complaints.

Students can submit complaints with their name, room number, category, and description. Complaints can then be marked as resolved. The project also demonstrates automated testing, linting, Docker containerization, and CI/CD deployment using GitHub Actions and Render.

## Features

- Submit a new hostel complaint
- Validate required complaint fields
- View all registered complaints
- View complaint status
- Mark pending complaints as resolved
- Dashboard showing:
  - Total complaints
  - Open complaints
  - Resolved complaints
- JSON API for complaints
- Health-check endpoint
- Running Git commit displayed in the footer
- Automated tests
- ESLint code-quality checks
- Docker containerization
- GitHub Actions CI/CD pipeline
- Deployment to Render

## Technology Stack

- Node.js
- Express.js
- HTML
- CSS
- JavaScript
- Node.js built-in test runner
- ESLint
- Docker
- GitHub Actions
- Render

## Application Routes

| Method | Route | Description |
|---|---|---|
| GET | `/` | Main hostel complaint register |
| POST | `/complaints` | Submit a new complaint |
| POST | `/complaints/:id/resolve` | Mark a complaint as resolved |
| GET | `/api/complaints` | Return all complaints as JSON |
| GET | `/health` | Application health check |

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/ritikasdhole/hostel-complaint-register.git
cd hostel-complaint-register