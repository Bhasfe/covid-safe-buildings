from resources.building import Building, BuildingList, BuildingRegister
from resources.camera import Camera, CreateCamera, CameraList
from logging.handlers import TimedRotatingFileHandler
from resources.room import RoomList, Room, RoomCreate
from flask_jwt_extended import JWTManager
from models.user import UserModel
from flask import Flask, jsonify
from blacklist import BLACKLIST
from datetime import timedelta
from dotenv import load_dotenv
from flask_restful import Api
from resources.user import (
    User,
    UserLogin,
    UserLogout,
    UserRegister,
    UserList,
    TokenRefresh,
)
from flask_cors import CORS
from datetime import date
import logging
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

app.secret_key = os.getenv("API_SECRET_KEY")

api = Api(app)


@app.before_first_request
def create_tables():
    db.create_all()
    admin_user = UserModel.find_by_id(1)
    if not admin_user:
        user = UserModel(
            first_name=os.getenv("ADMIN_FIRST_NAME"),
            last_name=os.getenv("ADMIN_LAST_NAME"),
            password=os.getenv("ADMIN_PASSWORD"),
            email=os.getenv("ADMIN_EMAIL"),
            phone=os.getenv("ADMIN_PHONE"),
            role=int(os.getenv("ADMIN_ROLE")),
        )
        user.save_to_db()


jwt = JWTManager(app)


@jwt.user_claims_loader
def add_claims_to_jwt(identity):
    role_information = {
        "is_general_admin": False,
        "is_building_admin": False,
        "identity": identity
    }
    role = UserModel.get_role(identity)
    if role == 1:
        role_information["is_general_admin"] = True
    elif role == 2:
        role_information["is_building_admin"] = True

    return role_information


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    return decrypted_token["jti"] in BLACKLIST


@jwt.expired_token_loader
def expired_token_callback():
    return (
        jsonify({"description": "The token has expired.", "error": "token_expired"}),
        401,
    )


@jwt.invalid_token_loader
def invalid_token_callback(error):
    return (
        jsonify(
            {"description": "Signature verification failed.", "error": "invalid_token"}
        ),
        401,
    )


@jwt.unauthorized_loader
def missing_token_callback(error):
    return (
        jsonify(
            {
                "description": "Request does not contain an access token.",
                "error": "authorization_required",
            }
        ),
        401,
    )


@jwt.needs_fresh_token_loader
def token_not_fresh_callback():
    return (
        jsonify(
            {"description": "The token is not fresh.", "error": "fresh_token_required"}
        ),
        401,
    )


api.add_resource(UserRegister, "/register")
api.add_resource(UserList, "/users")
api.add_resource(User, "/user/<int:user_id>")
api.add_resource(UserLogin, "/login")
api.add_resource(UserLogout, "/logout")
api.add_resource(TokenRefresh, "/refresh")
api.add_resource(BuildingList, "/buildings")
api.add_resource(Building, "/building/<int:building_id>")
api.add_resource(BuildingRegister, "/building")
api.add_resource(RoomList, "/building/<int:building_id>/rooms")
api.add_resource(Room, "/building/<int:building_id>/room/<int:room_id>")
api.add_resource(RoomCreate, "/building/<int:building_id>/room")
api.add_resource(CameraList, "/building/<int:building_id>/cameras")
api.add_resource(Camera, "/building/<building_id>/room/<room_id>/camera/<camera_id>")
api.add_resource(CreateCamera, "/building/<building_id>/room/<room_id>/camera")

if __name__ == "__main__":
    formatter = logging.Formatter('%(asctime)s %(name)s %(levelname)s %(message)s')

    handler = TimedRotatingFileHandler(filename='./logs/' + date.today().strftime("%d-%m-%Y") + '.log',
                                       when='midnight',
                                       backupCount=10)

    from db import db

    db.init_app(app)
    app.run(host=os.getenv("HOST"), port=int(os.getenv("PORT")), threaded=True, debug=os.getenv("DEBUG_MODE"))
