from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Note, Notebook

note_routes = Blueprint('notes', __name__)

# Get all notes in a notebook
@note_routes.route('/notebooks/<int:notebook_id>/notes', methods=['GET'])
@login_required
def get_notes_in_notebook(notebook_id):
    notebook = Notebook.query.get(notebook_id)

    if not notebook or notebook.user_id != current_user.id:
        return {"message": "Notebook couldn't be found"}, 404
    
    notes = Note.query.filter_by(notebook_id=notebook_id).all()
    return jsonify({'notes': [n.to_dict() for n in notes]}), 200

# Get a single note by ID
@note_routes.route('/notes/<int:note_id>', methods=['GET'])
@login_required
def get_note(note_id):
    note = Note.query.get(note_id)

    if not note or note.user_id != current_user.id:
        return {"message": "Note couldn't be found"}, 404

    return note.to_dict(), 200


# Create a note in a notebook
@note_routes.route('/notebooks/<int:notebook_id>/notes', methods=['POST'])
@login_required
def create_note(notebook_id):
    notebook = Notebook.query.get(notebook_id)

    if not notebook or notebook.user_id != current_user.id:
        return {"message": "Notebook couldn't be found"}, 404
    
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    if not title:
        return {"message": "Validation error", "errors": {"title": "Title is required!"}}, 400
    
    new_note = Note(
        user_id=current_user.id,
        notebook_id=notebook_id,
        title=title,
        content=content or ""
    )

    db.session.add(new_note)
    db.session.commit()
    return new_note.to_dict(), 201

# Update a note
@note_routes.route('/notes/<int:note_id>', methods=['PUT'])
@login_required
def update_note(note_id):
    note = Note.query.get(note_id)

    if not note or note.user_id != current_user.id:
        return {"message": "Note couldn't be found"}, 404
    
    data = request.get_json()
    title = data.get('title')

    if not title:
        return {"message": "Validation error", "errors": {"title": "Title is required!"}}, 400
    
    note.title = title
    note.content = data.get('content', note.content)
    db.session.commit()

    return note.to_dict(), 200

# Delete a note
@note_routes.route('/notes/<int:note_id>', methods=['DELETE'])
@login_required
def delete_note(note_id):
    note = Note.query.get(note_id)

    if not note or note.user_id != current_user.id:
        return {"message": "Note couldn't be found"}, 404
    
    db.session.delete(note)
    db.session.commit()
    return {'message': "Successfully deleted"}, 200