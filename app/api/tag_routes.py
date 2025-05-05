from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, Note, Tag

tag_routes = Blueprint('tags', __name__)

# Get all tags on a note
@tag_routes.route('/notes/<int:note_id>/tags', methods=['GET'])
@login_required
def get_tags_for_note(note_id):
    note = Note.query.get(note_id)

    if not note or note.user_id != current_user.id:
        return {"message": "Note couldn't be found"}, 404
    
    return {'tags': [tag.to_dict() for tag in note.tags]}, 200

# Add a tag to a note
@tag_routes.route('/notes/<int:note_id>/tags', methods=['POST'])
@login_required
def add_tag_to_note(note_id):
    note = Note.query.get(note_id)

    if not note or note.user_id != current_user.id:
        return {"message": "Note couldn't be found"}, 404
    
    data = request.get_json()
    tag_name = data.get('name')

    if not tag_name:
        return {
            "message": "Validation error",
            "errors": {"name": "Tag name is required!"}
        }, 400
    
    # Reuse existing tag if it exists, else create
    tag = Tag.query.filter_by(name=tag_name).first()

    if not tag:
        tag = Tag(name=tag_name)
        db.session.add(tag)

    if tag not in note.tags:
        note.tags.append(tag)
        db.session.commit()

    return tag.to_dict(), 201

# Remove a tag from a note
@tag_routes.route('/notes/<int:note_id>/tags/<int:tag_id>', methods=['DELETE'])
@login_required
def remove_tag_from_note(note_id, tag_id):
    note = Note.query.get(note_id)
    tag = Tag.query.get(tag_id)

    if not note or not tag or note.user_id != current_user.id:
        return {"message": "Note or Tag couldn't be found"}, 404
    
    if tag in note.tags:
        note.tags.remove(tag)
        db.session.commit()

    return {'message': "Successfully deleted"}, 200