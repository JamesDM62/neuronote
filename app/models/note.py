from .db import db, environment, SCHEMA, add_prefix_for_prod
from .note_tag import note_tags
from sqlalchemy.orm import relationship

class Note(db.Model):
    __tablename__ = 'notes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    notebook_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('notebooks.id')), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    title = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    user = relationship('User', back_populates='notes')
    notebook = relationship('Notebook', back_populates='notes')
    tags = relationship('Tag', secondary=note_tags, back_populates='notes')

    def to_dict(self):
        return {
            'id': self.id,
            'notebookId': self.notebook_id,
            'userId': self.user_id,
            'title': self.title,
            'content': self.content,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }
