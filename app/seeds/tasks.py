from app.models import db, Task, environment, SCHEMA
from sqlalchemy.sql import text

def seed_tasks():
    
    if environment == "production":
        db.session.execute(text(f"SET search_path TO {SCHEMA}"))
    
    tasks = [
        # User 1
        Task(user_id=1, title="Fix bug in note editor", description="Users report occasional crash when typing quickly.", is_complete=False),
        Task(user_id=1, title="Backup database", description="Ensure backups are scheduled and complete.", is_complete=False),
        Task(user_id=1, title="Update README", description="Add setup instructions and usage examples.", is_complete=False),
        Task(user_id=1, title="Optimize query speed", description="Speed up slow-loading notes page.", is_complete=False),
        # User 2
        Task(user_id=2, title="Test note filters", description="Verify tag and notebook filters return expected results.", is_complete=False),
        Task(user_id=2, title="Schedule team review", description="Set up time for group review of new features.", is_complete=False),
        Task(user_id=2, title="Refactor notebook model", description="Simplify relationships and remove dead code.", is_complete=False),
        Task(user_id=2, title="Write task docs", description="Write documentation for task-related endpoints.", is_complete=False),
        # User 3
        Task(user_id=3, title="Debug tag syncing", description="Some notes aren't retaining assigned tags.", is_complete=False),
        Task(user_id=3, title="Check production logs", description="Investigate error reports in Render logs.", is_complete=False),
        Task(user_id=3, title="Clean up old seeds", description="Remove legacy seed data no longer in use.", is_complete=False),
        Task(user_id=3, title="Deploy latest version", description="Test deployment process and check live DB sync.", is_complete=False),
    ]
    db.session.add_all(tasks)
    db.session.commit()

def undo_tasks():
    try:
        if environment == "production":
            db.session.execute(text(f'TRUNCATE table {SCHEMA}.tasks RESTART IDENTITY CASCADE;'))
        else:
            db.session.execute(text("DELETE FROM tasks"))
        db.session.commit()
    except Exception as e:
        print(f"Skipping undo_tasks: {e}")
        db.session.rollback()


