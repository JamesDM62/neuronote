from flask.cli import AppGroup
from .users import seed_users, undo_users
from .notebooks import seed_notebooks, undo_notebooks
from .notes import seed_notes, undo_notes
from .tasks import seed_tasks, undo_tasks
from .tags import seed_tags, undo_tags
from .note_tags import seed_note_tags, undo_note_tags
from sqlalchemy.sql import text
import time

import os

environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():

    # Optional: delay to ensure schema is fully ready (esp. on Render)
    time.sleep(1)

    # Ensure we're using correct schema in case Alembic context is stale
    from app.models.db import db, SCHEMA, environment
    if environment == "production":
        db.session.execute(text(f"SET search_path TO {SCHEMA}"))


    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
    seed_users()
    from .users import demo_id, marnie_id, bobbie_id
    from app.models import Notebook

    Notebook.demo_id = demo_id
    Notebook.marnie_id = marnie_id
    Notebook.bobbie_id = bobbie_id
    # Add other seed functions here
    seed_notebooks()
    seed_notes()
    seed_tasks()
    seed_tags()
    seed_note_tags()

# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    # Add other undo functions here
    undo_note_tags()
    undo_tags()
    undo_tasks()
    undo_notes()
    undo_notebooks()
    undo_users()
