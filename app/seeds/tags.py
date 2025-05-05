from app.models import db, Tag, environment, SCHEMA
from sqlalchemy.sql import text

def seed_tags():
    tags = [
        Tag(name="urgent"),
        Tag(name="idea"),
        Tag(name="research"),
        Tag(name="review"),
        Tag(name="bug"),
        Tag(name="feature")
    ]
    db.session.add_all(tags)
    db.session.commit()

def undo_tags():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tags RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tags"))
    db.session.commit()
