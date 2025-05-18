from app.models import db, note_tags, environment, SCHEMA
from sqlalchemy.sql import text

def seed_note_tags():
    # Each tuple is (note_id, tag_id)
    relationships = [
        (1, 2), (1, 3),
        (2, 3), (2, 4),
        (3, 4), (3, 5),
        (4, 5), (4, 6),
        (5, 6), (5, 1),
        (6, 1), (6, 2)
    ]

    for note_id, tag_id in relationships:
        db.session.execute(note_tags.insert().values(note_id=note_id, tag_id=tag_id))

    db.session.commit()

def undo_note_tags():
    try:
        if environment == "production":
            db.session.execute(text(f'TRUNCATE table {SCHEMA}.note_tags RESTART IDENTITY CASCADE;'))
        else:
            db.session.execute(text("DELETE FROM note_tags"))
        db.session.commit()
    except Exception as e:
        print(f"Skipping undo_note_tags: {e}")
        db.session.rollback()
    
