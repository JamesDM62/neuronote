from flask import Blueprint
from flask_login import current_user

session_routes = Blueprint('session', __name__)


@session_routes.route('', methods=['GET'])  # GET /api/session
def restore_user():
    if current_user.is_authenticated:
        return {'user': current_user.to_dict()}
    return {'user': None}
