# Resource for building
from flask_jwt_extended import jwt_required, get_jwt_claims
from flask_restful import Resource, reqparse
from models.camera import CameraModel
from utils.helpers import Helpers
from flask import request

_camera_parser_ = reqparse.RequestParser()
_camera_parser_.add_argument(
    "ip_address", type=str, required=True, help="ip_address cannot be left blank!"
)
_camera_parser_.add_argument(
    "building_id", type=int, required=True, help="building_ip cannot be left blank!"
)
_camera_parser_.add_argument(
    "room_id", type=str, required=False, help="room_id cannot be left blank!"
)


class Camera(Resource):
    @classmethod
    @jwt_required
    def get(cls, **kwargs):
        claims = get_jwt_claims()
        if claims['is_general_admin'] or claims['is_building_admin']:
            camera = CameraModel.find_by_id(kwargs["camera_id"])
            if camera:
                return camera.json()
            return {'message': 'Camera not found'}, 404
        else:
            return {"message": "User not authorized for this request!"}, 401

    @classmethod
    @jwt_required
    def put(cls, **kwargs):
        claims = get_jwt_claims()
        if claims['is_general_admin'] or claims['is_building_admin']:
            data = request.get_json()
            camera = CameraModel.find_by_id(kwargs["camera_id"])
            if not camera:
                return {'message': 'Camera not found'}, 404
            camera.update(Helpers.prune_dictionary(data))
            return camera.json()
        else:
            return {"message": "User not authorized for this request!"}, 401

    @classmethod
    @jwt_required
    def delete(cls, **kwargs):
        claims = get_jwt_claims()
        if claims['is_general_admin'] or claims['is_building_admin']:
            camera = CameraModel.find_by_id(kwargs["camera_id"])
            if not camera:
                return {'message': 'Camera not found'}, 404
            camera.delete_from_db()
            return {'message': 'Camera deleted'}, 200
        else:
            return {"message": "User not authorized for this request!"}, 401


class CreateCamera(Resource):
    @classmethod
    @jwt_required
    def post(cls, **kwargs):
        claims = get_jwt_claims()
        if claims['is_general_admin'] or claims['is_building_admin']:
            data = request.get_json()
            if not data:
                return {'message': 'No input data provided'}, 400
            camera = CameraModel(**data, building_id=kwargs["building_id"], room_id=kwargs["room_id"])
            camera.save_to_db()
            return camera.json(), 201
        else:
            return {"message": "User not authorized for this request!"}, 401


class CameraList(Resource):
    @jwt_required
    def get(self, building_id):
        return {'cameras': [room.json() for room in CameraModel.find_by_building_id(building_id)]}
