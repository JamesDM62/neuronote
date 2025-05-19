"""make user_id in tags non-nullable

Revision ID: f0af67ae19ae
Revises: b6b9e57e9928
Create Date: 2025-05-15 XX:XX:XX.XXX
"""
from alembic import op
import sqlalchemy as sa
from flask import current_app
import os

# revision identifiers, used by Alembic.
revision = 'f0af67ae19ae'
down_revision = 'b6b9e57e9928'
branch_labels = None
depends_on = None


def upgrade():
    env = os.getenv("FLASK_ENV")
    schema = os.getenv("SCHEMA") if env == "production" else None

    #  Backfill missing user_id values with ID 1
    op.execute("UPDATE tags SET user_id = 1 WHERE user_id IS NULL;")

    with op.batch_alter_table('tags', schema=schema) as batch_op:
        batch_op.alter_column('user_id', nullable=False)


def downgrade():
    env = os.getenv("FLASK_ENV")
    schema = os.getenv("SCHEMA") if env == "production" else None

    with op.batch_alter_table('tags', schema=schema) as batch_op:
        batch_op.alter_column('user_id', nullable=True)

