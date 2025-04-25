# 🧠 `Neuronote`

## Link to Live Site:
URL PLACEHOLDER

## Summary

Neuronote is a full-stack web application for taking notes, organizing notebooks, and keeping up with daily tasks — built using Flask for the backend and React (via Vite) for the frontend.

## 🚀 Features

- Create, edit, and delete notes
- Tagging system for easy organization
- Fast frontend built with Vite + React
- RESTful API with Flask + SQLAlchemy
- Secure user authentication and CSRF protection
- PostgreSQL or SQLite support (dev/prod)

## 🧰 Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | React, Vite, Redux |
| Backend   | Flask, Flask-Migrate, Flask-Login |
| Database  | PostgreSQL / SQLite           |
| Dev Tools | Pipenv / venv, Prettier, Git  |

## Screenshots

## Future Features
### Bonus: Filter

-Users should be able to filter out their notes by tag and/or notebook.

-Users should be able to view the results of their filter.

## 🛠️ Getting Started

### Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Database setup
flask db init
flask db migrate -m "initial"
flask db upgrade

### Frontend Setup

cd react-vite
npm install
npm run dev

