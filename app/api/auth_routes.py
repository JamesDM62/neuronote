from flask import Blueprint, request, session
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
from datetime import timedelta
from flask import current_app as app

auth_routes = Blueprint('auth', __name__)


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return {'user': current_user.to_dict()}
    return {'errors': {'message': 'Unauthorized'}}, 401


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        credential = form.data['credential']
        password = form.data['password']
        # Add the user to the session, we are logged in!
        user = User.query.filter((User.email == credential) | (User.username == credential)).first()
        
        if user and user.check_password(password):
            login_user(user)

            # Make session permanent and set expiration to 7 days
            session.permanent = True  # This ensures the session persists between browser restarts
            app.permanent_session_lifetime = timedelta(days=7) 
            
            return {'user': user.to_dict()}
    
    return form.errors, 401


@auth_routes.route('/logout', methods=["DELETE"])
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}, 200


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User(
            username=form.data['username'],
            email=form.data['email'],
            first_name=form.data['first_name'],
            last_name=form.data['last_name'],
            password=form.data['password']
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return {"user": user.to_dict()}, 201
    return form.errors, 401


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': {'message': 'Unauthorized'}}, 401