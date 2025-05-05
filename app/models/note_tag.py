from .db import db, environment, SCHEMA, add_prefix_for_prod

note_tags = db.Table(
    'note_tags',
    db.Model.metadata,
    db.Column('note_id', db.Integer, db.ForeignKey(add_prefix_for_prod('notes.id')), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey(add_prefix_for_prod('tags.id')), primary_key=True)
)

if environment == 'production':
    note_tags.schema = SCHEMA