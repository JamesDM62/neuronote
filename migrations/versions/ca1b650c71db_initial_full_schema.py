"""Initial full schema

Revision ID: ca1b650c71db
Revises: 
Create Date: 2025-04-30 14:00:34.992916
"""

from alembic import op
import sqlalchemy as sa
from flask import current_app

# revision identifiers, used by Alembic.
revision = 'ca1b650c71db'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    env = current_app.config.get("ENV")
    schema = current_app.config.get("SCHEMA") if env == "production" else None

    # Tags table
    op.create_table('tags',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name'),
        schema=schema
    )

    # Users table
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(length=40), nullable=False),
        sa.Column('first_name', sa.String(length=40), nullable=False),
        sa.Column('last_name', sa.String(length=40), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username'),
        schema=schema
    )

    # Notebooks table
    op.create_table('notebooks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=50), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('image_url', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], [f'{schema}.users.id'] if schema else ['users.id']),
        sa.PrimaryKeyConstraint('id'),
        schema=schema
    )

    # Tasks table
    op.create_table('tasks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=50), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_complete', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], [f'{schema}.users.id'] if schema else ['users.id']),
        sa.PrimaryKeyConstraint('id'),
        schema=schema
    )

    # Notes table
    op.create_table('notes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('notebook_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=50), nullable=False),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['notebook_id'], [f'{schema}.notebooks.id'] if schema else ['notebooks.id']),
        sa.ForeignKeyConstraint(['user_id'], [f'{schema}.users.id'] if schema else ['users.id']),
        sa.PrimaryKeyConstraint('id'),
        schema=schema
    )

    # Note-Tags junction table
    op.create_table('note_tags',
        sa.Column('note_id', sa.Integer(), nullable=False),
        sa.Column('tag_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['note_id'], [f'{schema}.notes.id'] if schema else ['notes.id']),
        sa.ForeignKeyConstraint(['tag_id'], [f'{schema}.tags.id'] if schema else ['tags.id']),
        sa.PrimaryKeyConstraint('note_id', 'tag_id'),
        schema=schema
    )


def downgrade():
    env = current_app.config.get("ENV")
    schema = current_app.config.get("SCHEMA") if env == "production" else None

    op.drop_table('note_tags', schema=schema)
    op.drop_table('notes', schema=schema)
    op.drop_table('tasks', schema=schema)
    op.drop_table('notebooks', schema=schema)
    op.drop_table('users', schema=schema)
    op.drop_table('tags', schema=schema)


