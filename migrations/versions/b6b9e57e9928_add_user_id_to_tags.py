"""add user_id to tags

Revision ID: b6b9e57e9928
Revises: ca1b650c71db
Create Date: 2025-05-15 21:22:53.457108
"""
from alembic import op
import sqlalchemy as sa
from flask import current_app
import os

# revision identifiers, used by Alembic.
revision = 'b6b9e57e9928'
down_revision = 'ca1b650c71db'
branch_labels = None
depends_on = None


def upgrade():
    env = os.getenv("FLASK_ENV")
    schema = os.getenv("SCHEMA") if env == "production" else None

    with op.batch_alter_table('tags', schema=schema) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(
            'fk_tags_user_id_users',
            'users',
            ['user_id'], ['id'],
            ondelete='CASCADE'
        )


def downgrade():
    env = os.getenv("FLASK_ENV")
    schema = os.getenv("SCHEMA") if env == "production" else None

    with op.batch_alter_table('tags', schema=schema) as batch_op:
        batch_op.drop_constraint('fk_tags_user_id_users', type_='foreignkey')
        batch_op.drop_column('user_id')


