from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Notebook

notebook_routes = Blueprint('notebooks', __name__)

# Get all notebooks of current user
@notebook_routes.route('/', methods=['GET'])
@login_required
def get_user_notebooks():
    notebooks = Notebook.query.filter_by(user_id=current_user.id).all()
    return jsonify({'notebooks': [n.to_dict() for n in notebooks]}), 200

# Create new notebook
@notebook_routes.route('/', methods=['POST'])
@login_required
def create_notebook():
    data = request.get_json()

    title = str(data.get('title')).strip()
    description = data.get('description')
    image_url = data.get('imageUrl')

    errors = {}

    if not title:
        errors['title'] = "Title is required"
    elif len(title) > 50:
        errors['title'] = "Title must be less than 50 characters"

    if not description:
        errors['description'] = "Description is required"
    elif len(description) < 10:
        errors['description'] = "Description must be at least 10 characters"

    if not image_url:
        errors['imageUrl'] = "Image URL is required"

    if errors:
        return errors, 400

    new_notebook = Notebook(
        user_id=current_user.id,
        title=title,
        description=description,
        image_url=image_url
    )
    db.session.add(new_notebook)
    db.session.commit()
    return new_notebook.to_dict(), 201

# Update a notebook
@notebook_routes.route('/<int:notebook_id>', methods=['PUT'])
@login_required
def update_notebook(notebook_id):
    notebook = Notebook.query.get(notebook_id)

    if not notebook or notebook.user_id != current_user.id:
        return {"message": "Notebook couldn't be found"}, 404

    data = request.get_json()
    title = data.get('title', '')
    description = data.get('description', '')
    image_url = data.get('imageUrl', '')

    errors = {}

    if not title:
        errors['title'] = "Title is required"
    elif len(title) > 50:
        errors['title'] = "Title must be less than 50 characters"

    if not description:
        errors['description'] = "Description is required"
    elif len(description) < 10:
        errors['description'] = "Description must be at least 10 characters"

    if not image_url:
        errors['imageUrl'] = "Image URL is required"

    if errors:
        return {'message': 'Bad Request', 'errors': errors}, 400

    notebook.title = title
    notebook.description = data.get('description')
    notebook.image_url = data.get('imageUrl')
    db.session.commit()

    return notebook.to_dict(), 200

# Delete a notebook
@notebook_routes.route('/<int:notebook_id>', methods=['DELETE'])
@login_required
def delete_notebook(notebook_id):
    notebook = Notebook.query.get(notebook_id)

    if not notebook or notebook.user_id != current_user.id:
        return {"message": "Notebook couldn't be found"}, 404
    
    # Prevent deletion if notebook contains notes
    if notebook.notes and len(notebook.notes) > 0:
        return {
            "error": "Cannot delete notebook while it contains notes."
        }, 400
    
    db.session.delete(notebook)
    db.session.commit()

    return {'message': 'Successfully deleted'}, 200
