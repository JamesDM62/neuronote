from app.models import db, Notebook, environment, SCHEMA
from sqlalchemy.sql import text

def seed_notebooks():
    notebooks = [
        Notebook(user_id=1, title="Project Planning", description="Organize thoughts and milestones for the upcoming product launch.", 
                 image_url="https://images.unsplash.com/photo-1581093588401-26ca5f166a4e?fit=crop&w=800&q=80"),
        Notebook(user_id=1, title="Meeting Notes", description="Notes from weekly syncs and strategic planning sessions.",
                 image_url="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?fit=crop&w=800&q=80"),
        Notebook(user_id=2, title="Design Sketches", description="Initial design drafts and UI component sketches.",
                 image_url="https://images.unsplash.com/photo-1589998059171-4f27b73ec755?fit=crop&w=800&q=80"),
        Notebook(user_id=2, title="Personal Journal", description="Daily personal reflections and writing practice.",
                 image_url="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?fit=crop&w=800&q=80"),
        Notebook(user_id=3, title="Daily Standups", description="Summaries of team standup meetings.",
                 image_url="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?fit=crop&w=800&q=80"),
        Notebook(user_id=3, title="Feature Backlog", description="Tracking features, bugs, and priorities.",
                 image_url="https://images.unsplash.com/photo-1573497491208-6b1acb260507?fit=crop&w=800&q=80"),
    ]

    db.session.add_all(notebooks)
    db.session.commit()

def undo_notebooks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.notebooks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text(f"DELETE FROM notebooks"))
    db.session.commit()