from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, Task

task_routes = Blueprint('tasks', __name__)

# Get all tasks for current user
@task_routes.route('/', methods=['GET'])
@login_required
def get_tasks():
    tasks = Task.query.filter_by(user_id=current_user.id).all()

    if not tasks:
        return {'message': "tasks couldn't be found"}, 404
    
    return {'tasks': [t.to_dict() for t in tasks]}, 200

# Create a new task
@task_routes.route('/', methods=['POST'])
@login_required
def create_task():
    data = request.get_json()

    title = data.get('title')
    if not title:
        return {
            "message": "Validation error",
            "errors": {"title": "Title is required!"}
        }, 400
    
    new_task = Task(
        user_id=current_user.id,
        title=title,
        description=data.get('description', ''),
        is_complete=data.get('isComplete', False)
    )
    db.session.add(new_task)
    db.session.commit()
    return new_task.to_dict(), 201

# Update a task
@task_routes.route('/<int:task_id>', methods=['PUT'])
@login_required
def update_task(task_id):
    task = Task.query.get(task_id)

    if not task or task.user_id != current_user.id:
        return {"message": "Task couldn't be found"}, 404
    
    data = request.get_json()
    title = data.get('title')

    if not title:
        return {
            "message": "Validation error",
            "errors": {"title": "Title is required!"}
        }, 400
    
    task.title = title
    task.description = data.get('description', task.description)
    task.is_complete = data.get('isComplete', task.is_complete)

    db.session.commit()
    return task.to_dict(), 200

# Delete a task
@task_routes.route('/<int:task_id>', methods=['DELETE'])
@login_required
def delete_task(task_id):
    task = Task.query.get(task_id)

    if not task or task.user_id != current_user.id:
        return {"message": "Task couldn't be found"}, 404
    
    db.session.delete(task)
    db.session.commit()

    return {'message': "Successfully deleted"}, 200