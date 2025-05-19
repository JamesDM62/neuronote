"""schema-aware reset

Revision ID: schema_reset
Revises:
Create Date: 2025-05-19 XX:XX:XX.XXXXX
"""

from alembic import op
import sqlalchemy as sa
import os

# revision identifiers, used by Alembic.
revision = 'schema_reset'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    env = os.getenv("FLASK_ENV")
    SCHEMA = os.getenv("SCHEMA") if env == "production" else None

    # Tags table (created first because foreign key added later)
    op.create_table('tags',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name'),
        schema=SCHEMA
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
        schema=SCHEMA
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
        sa.ForeignKeyConstraint(['user_id'], [f'{SCHEMA}.users.id'] if SCHEMA else ['users.id']),
        sa.PrimaryKeyConstraint('id'),
        schema=SCHEMA
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
        sa.ForeignKeyConstraint(['user_id'], [f'{SCHEMA}.users.id'] if SCHEMA else ['users.id']),
        sa.PrimaryKeyConstraint('id'),
        schema=SCHEMA
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
        sa.ForeignKeyConstraint(['notebook_id'], [f'{SCHEMA}.notebooks.id'] if SCHEMA else ['notebooks.id']),
        sa.ForeignKeyConstraint(['user_id'], [f'{SCHEMA}.users.id'] if SCHEMA else ['users.id']),
        sa.PrimaryKeyConstraint('id'),
        schema=SCHEMA
    )

    # Note-Tags table
    op.create_table('note_tags',
        sa.Column('note_id', sa.Integer(), nullable=False),
        sa.Column('tag_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['note_id'], [f'{SCHEMA}.notes.id'] if SCHEMA else ['notes.id']),
        sa.ForeignKeyConstraint(['tag_id'], [f'{SCHEMA}.tags.id'] if SCHEMA else ['tags.id']),
        sa.PrimaryKeyConstraint('note_id', 'tag_id'),
        schema=SCHEMA
    )

    # Add user_id to tags (as nullable first)
    with op.batch_alter_table('tags', schema=SCHEMA) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(
            'fk_tags_user_id_users',
            'users',
            ['user_id'], ['id'],
            ondelete='CASCADE'
        )

    # Backfill user_id in tags (assume ID 1 is valid)
    op.execute("UPDATE {}tags SET user_id = 1 WHERE user_id IS NULL;".format(f"{SCHEMA}." if SCHEMA else ""))

    # Then set user_id to NOT NULL
    with op.batch_alter_table('tags', schema=SCHEMA) as batch_op:
        batch_op.alter_column('user_id', nullable=False)


def downgrade():
    env = os.getenv("FLASK_ENV")
    SCHEMA = os.getenv("SCHEMA") if env == "production" else None

    with op.batch_alter_table('tags', schema=SCHEMA) as batch_op:
        batch_op.drop_constraint('fk_tags_user_id_users', type_='foreignkey')
        batch_op.drop_column('user_id')

    op.drop_table('note_tags', schema=SCHEMA)
    op.drop_table('notes', schema=SCHEMA)
    op.drop_table('tasks', schema=SCHEMA)
    op.drop_table('notebooks', schema=SCHEMA)
    op.drop_table('users', schema=SCHEMA)
    op.drop_table('tags', schema=SCHEMA)
