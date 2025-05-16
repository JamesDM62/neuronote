"""make user_id in tags non-nullable

Revision ID: xxxxxxxxxxxx
Revises: b6b9e57e9928
Create Date: 2025-05-15 XX:XX:XX.XXX
"""
from alembic import op
import sqlalchemy as sa
from flask import current_app

# revision identifiers, used by Alembic.
revision = 'xxxxxxxxxxxx'
down_revision = 'b6b9e57e9928'
branch_labels = None
depends_on = None


def upgrade():
    env = current_app.config.get("ENV")
    schema = current_app.config.get("SCHEMA") if env == "production" else None

    with op.batch_alter_table('tags', schema=schema) as batch_op:
        batch_op.alter_column('user_id', nullable=False)


def downgrade():
    env = current_app.config.get("ENV")
    schema = current_app.config.get("SCHEMA") if env == "production" else None

    with op.batch_alter_table('tags', schema=schema) as batch_op:
        batch_op.alter_column('user_id', nullable=True)
