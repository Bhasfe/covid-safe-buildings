from flask_restful import Resource, reqparse
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_refresh_token_required,
    get_jwt_identity,
    jwt_required,
    get_raw_jwt,
    get_jwt_claims,
)
from models.user import UserModel
from blacklist import BLACKLIST
from flask import request

_user_parser_ = reqparse.RequestParser()
_user_parser_.add_argument(
    "email", type=str, required=True, help="email cannot be left blank!"
)
_user_parser_.add_argument(
    "password", type=str, required=True, help="password cannot be left blank!"
)
_user_parser_.add_argument(
    "first_name", type=str, required=True, help="first_name cannot be left blank!"
)
_user_parser_.add_argument(
    "last_name", type=str, required=True, help="last_name cannot be left blank!"
)
_user_parser_.add_argument(
    "phone", type=str, required=False
)
_user_parser_.add_argument(
    "role", type=int, required=False, choices=(1, 2, 3), default=3, help="Only 1,2,3 accepted!"
)
_user_parser_.add_argument(
    "age", type=int, required=False
)
_user_parser_.add_argument(
    "pcr_result", type=bool, required=False, default=False
)
_user_parser_.add_argument(
    "had_covid", type=bool, required=False, default=False
)
_user_parser_.add_argument(
    "vac_dose", type=int, required=False, default=0
)


class UserRegister(Resource):
    @staticmethod
    def post():
        data = _user_parser_.parse_args()

        if UserModel.find_by_email(data["email"]):
            return {"message": "A user with that email already exists!"}, 400

        user = UserModel(**data)
        user.save_to_db()

        return {"message": "User created successfully!"}, 201


class UserLogin(Resource):
    @classmethod
    def post(cls):
        data = request.get_json()
        user = UserModel.find_by_email(data["email"])

        if user and user.check_password(data["password"]):
            access_token = create_access_token(identity=user.id, fresh=True)
            refresh_token = create_refresh_token(user.id)
            return {
                       "access_token": access_token,
                       "refresh_token": refresh_token,
                       "user": user.json(),
                   }, 200

        return {"message": "Invalid credentials!"}, 401


class User(Resource):
    @classmethod
    @jwt_required
    def get(cls, user_id):
        claims = get_jwt_claims()
        if claims["is_general_admin"]:
            user = UserModel.find_by_id(user_id)
            if not user:
                return {"message": "User not found!"}, 404
            return user.json()
        return {"message": "User not authorized for this request!"}, 401

    @classmethod
    @jwt_required
    def delete(cls, user_id):
        claims = get_jwt_claims()
        if claims["is_general_admin"]:
            user = UserModel.find_by_id(user_id)
            if not user:
                return {"message": "User not found!"}, 404
            user.delete_from_db()
            return {"message": "User deleted!"}, 200
        else:
            return {"message": "User not authorized for this request!"}, 401

    @classmethod
    @jwt_required
    def put(cls, user_id):
        claims = get_jwt_claims()
        if claims["identity"] == user_id or claims["is_general_admin"]:
            user = UserModel.find_by_id(user_id)
            if not user:
                return {"message": "User not found!"}, 404
            data = request.get_json()
            user.email = data.get("email", user.email)
            user.password_hash = user.set_password(data["password"]) if data.get("password") else user.password_hash
            user.first_name = data.get("first_name", user.first_name)
            user.last_name = data.get("last_name", user.last_name)
            user.phone = data.get("phone", user.phone)
            user.role = data.get("role", user.role)
            user.age = data.get("age", user.age)
            user.pcr_result = data.get("pcr_result", user.pcr_result)
            user.had_covid = data.get("had_covid", user.had_covid)
            user.vac_dose = data.get("vac_dose", user.vac_dose)
            user.save_to_db()
            return {"message": "User updated successfully!"}, 200
        else:
            return {"message": "User not authorized for this request!"}, 401


class UserList(Resource):
    @classmethod
    @jwt_required
    def get(cls):
        return {"users": [user.json() for user in UserModel.find_all()]}


class UserLogout(Resource):
    @jwt_required
    def post(self):
        jti = get_raw_jwt()["jti"]
        user_id = get_jwt_identity()
        BLACKLIST.add(jti)
        return {"message": f"User {user_id} has been logged out."}, 200


class TokenRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        new_token = create_access_token(identity=current_user, fresh=False)
        return {"access_token": new_token}, 200
