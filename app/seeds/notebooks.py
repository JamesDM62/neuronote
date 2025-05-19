from app.models import db, Notebook, SCHEMA
from .users import demo_id, marnie_id, bobbie_id
from sqlalchemy.sql import text
import os

environment = os.getenv("FLASK_ENV")

def seed_notebooks():
    
    if environment == "production":
        db.session.execute(text(f"SET search_path TO {SCHEMA}"))
    
    notebooks = [
        Notebook(user_id=Notebook.demo_id, title="Project Planning", description="Organize thoughts and milestones for the upcoming product launch.", 
                 image_url="https://images.unsplash.com/photo-1581093588401-26ca5f166a4e?fit=crop&w=800&q=80"),
        Notebook(user_id=Notebook.demo_id, title="Meeting Notes", description="Notes from weekly syncs and strategic planning sessions.",
                 image_url="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?fit=crop&w=800&q=80"),
        Notebook(user_id=Notebook.marnie_id, title="Design Sketches", description="Initial design drafts and UI component sketches.",
                 image_url="https://images.unsplash.com/photo-1589998059171-4f27b73ec755?fit=crop&w=800&q=80"),
        Notebook(user_id=Notebook.marnie_id, title="Personal Journal", description="Daily personal reflections and writing practice.",
                 image_url="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?fit=crop&w=800&q=80"),
        Notebook(user_id=Notebook.bobbie_id, title="Daily Standups", description="Summaries of team standup meetings.",
                 image_url="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?fit=crop&w=800&q=80"),
        Notebook(user_id=Notebook.bobbie_id, title="Feature Backlog", description="Tracking features, bugs, and priorities.",
                 image_url="https://images.unsplash.com/photo-1573497491208-6b1acb260507?fit=crop&w=800&q=80"),
    ]

    db.session.add_all(notebooks)
    db.session.commit()

def undo_notebooks():
    try:
        if environment == "production":
            db.session.execute(text(f'TRUNCATE table {SCHEMA}.notebooks RESTART IDENTITY CASCADE;'))
        else:
            db.session.execute(text("DELETE FROM notebooks"))
        db.session.commit()
    except Exception as e:
        print(f"Skipping undo_notebooks: {e}")
        db.session.rollback()
