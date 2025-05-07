from flask import Blueprint, jsonify
from flask_login import current_user

session_routes = Blueprint('session', __name__)


@session_routes.route('', methods=['GET'])  # GET /api/session
def restore_user():
    if current_user.is_authenticated:
        return jsonify(current_user.to_dict()), 200
    return jsonify({"user": None}), 200
