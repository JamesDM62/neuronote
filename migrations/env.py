import logging
from logging.config import fileConfig
from sqlalchemy import text

from alembic import context
from flask import current_app
import os

# Get environment and schema
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# Alembic config
config = context.config
fileConfig(config.config_file_name)
logger = logging.getLogger('alembic.env')

def get_engine():
    try:
        # Flask-SQLAlchemy <3
        return current_app.extensions['migrate'].db.get_engine()
    except (TypeError, AttributeError):
        # Flask-SQLAlchemy >=3
        return current_app.extensions['migrate'].db.engine

def get_engine_url():
    try:
        return get_engine().url.render_as_string(hide_password=False).replace('%', '%%')
    except AttributeError:
        return str(get_engine().url).replace('%', '%%')

# Delay all Flask access until app context is pushed
def get_metadata():
    from app.models import db
    return db.metadata

def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = os.environ.get('DATABASE_URL')
    config.set_main_option('sqlalchemy.url', url)

    context.configure(
        url=url,
        target_metadata=get_metadata(),
        literal_binds=True
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode."""
    from app import create_app
    app = create_app()

    with app.app_context():
        config.set_main_option('sqlalchemy.url', os.environ.get('DATABASE_URL'))

        def process_revision_directives(context, revision, directives):
            if getattr(config.cmd_opts, 'autogenerate', False):
                script = directives[0]
                if script.upgrade_ops.is_empty():
                    directives[:] = []
                    logger.info('No changes in schema detected.')

        conf_args = current_app.extensions['migrate'].configure_args

        if conf_args.get("process_revision_directives") is None:
            conf_args["process_revision_directives"] = process_revision_directives

        if environment == "production":
            conf_args["version_table_schema"] = SCHEMA

        connectable = get_engine()

        with connectable.connect() as connection:
            if SCHEMA is None and environment == "production":
                raise Exception("SCHEMA is not set! Did you forget to define it in Render environment settings?")

            if environment == "production":
                connection.execute(text(f"CREATE SCHEMA IF NOT EXISTS {SCHEMA}"))
                connection.execute(text(f"SET search_path TO {SCHEMA}"))


            context.configure(
                connection=connection,
                target_metadata=get_metadata(),
                **conf_args
            )

            with context.begin_transaction():
                context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
