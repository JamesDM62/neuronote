from app.models import db, Tag, User, environment, SCHEMA
from sqlalchemy.sql import text

def seed_tags():
    # Fetch seeded users by email
    demo = User.query.filter_by(email='demo@aa.io').first()
    marnie = User.query.filter_by(email='marnie@aa.io').first()
    bobbie = User.query.filter_by(email='bobbie@aa.io').first()

    tags = [
        Tag(name="urgent", user_id=demo.id),
        Tag(name="idea", user_id=demo.id),
        Tag(name="research", user_id=marnie.id),
        Tag(name="review", user_id=marnie.id),
        Tag(name="bug", user_id=bobbie.id),
        Tag(name="feature", user_id=bobbie.id)
    ]

    db.session.add_all(tags)
    db.session.commit()

def undo_tags():
    try:
        if environment == "production":
            db.session.execute(text(f'TRUNCATE table {SCHEMA}.tags RESTART IDENTITY CASCADE;'))
        else:
            db.session.execute(text("DELETE FROM tags"))
        db.session.commit()
    except Exception as e:
        print(f"Skipping undo_tags: {e}")
        db.session.rollback()
