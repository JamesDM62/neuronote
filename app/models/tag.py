from .db import db, environment, SCHEMA, add_prefix_for_prod
from .note_tag import note_tags
from sqlalchemy.orm import relationship

class Tag(db.Model):
    __tablename__ = 'tags'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)

    user = relationship("User", back_populates="tags")

    notes = relationship(
        'Note',
        secondary=note_tags,
        back_populates='tags'
    )


    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

