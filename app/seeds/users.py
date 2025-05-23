from app.models import db, User, SCHEMA
from sqlalchemy.sql import text
import os

environment = os.getenv("FLASK_ENV")

demo_id = None
marnie_id = None
bobbie_id = None

# Adds a demo user, you can add other users here if you want
def seed_users():
    global demo_id, marnie_id, bobbie_id

    if environment == "production":
        db.session.execute(text(f"SET search_path TO {SCHEMA}"))

    demo = User(
        username='Demo',
        first_name='Demo',
        last_name='User',
        email='demo@aa.io',
        password='password'
    )
    marnie = User(
        username='marnie',
        first_name='Marnie',
        last_name='Smith',
        email='marnie@aa.io',
        password='password'
    )
    bobbie = User(
        username='bobbie',
        first_name='Bobbie',
        last_name='Brown',
        email='bobbie@aa.io',
        password='password'
    )

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.commit()

    demo_id = demo.id
    marnie_id = marnie.id
    bobbie_id = bobbie.id


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    try:
        if environment == "production":
            db.session.execute(text(f'TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;'))
        else:
            db.session.execute(text("DELETE FROM users"))
        db.session.commit()
    except Exception as e:
        print(f"Skipping undo_users: {e}")
        db.session.rollback()
