from flask_jwt_extended import jwt_required, get_jwt_claims
from flask_restful import Resource, reqparse
from models.room import RoomModel
from utils.helpers import Helpers
from flask import request

_room_parser_ = reqparse.RequestParser()
_room_parser_.add_argument('name',
                           type=str,
                           required=True,
                           help='name cannot be left blank!'
                           )

_room_parser_.add_argument('description',
                           type=str,
                           required=False
                           )

_room_parser_.add_argument('area',
                           type=float,
                           required=True,
                           help='Area cannot be left blank!'
                           )


class Room(Resource):
    @classmethod
    @jwt_required
    def get(cls, **kwargs):
        room = RoomModel.find_by_id(kwargs["room_id"])
        if room:
            return room.json()
        return {'message': 'Room not found'}, 404

    @classmethod
    @jwt_required
    def put(cls, **kwargs):
        claims = get_jwt_claims()
        if claims['is_general_admin'] or claims['is_building_admin']:
            data = request.get_json()
            room = RoomModel.find_by_id(kwargs["room_id"])
            if not room:
                return {'message': 'Room not found'}, 404
            if "building_id" in data.keys():
                return {"message": "Building id cannot be updated!"}, 401
            room.update(Helpers.prune_dictionary(data))
            return room.json()
        else:
            return {"message": "User not authorized for this request!"}, 401

    @classmethod
    @jwt_required
    def delete(cls, **kwargs):
        claims = get_jwt_claims()
        if claims['is_general_admin'] or claims['is_building_admin']:
            room = RoomModel.find_by_id(kwargs["room_id"])
            if not room:
                return {'message': 'Room not found'}, 404
            room.delete_from_db()
            return {'message': 'Room deleted'}, 200
        else:
            return {"message": "User not authorized for this request!"}, 401


class RoomList(Resource):
    @jwt_required
    def get(self, building_id):
        return {'rooms': [room.json() for room in RoomModel.find_by_building_id(building_id)]}


class RoomCreate(Resource):
    @classmethod
    @jwt_required
    def post(cls, building_id):
        claims = get_jwt_claims()
        if claims['is_general_admin'] or claims['is_building_admin']:
            data = _room_parser_.parse_args()
            if not data:
                return {'message': 'No input data provided'}, 400
            room = RoomModel(**data, building_id=building_id)
            room.save_to_db()
            return room.json(), 201
        else:
            return {"message": "User not authorized for this request!"}, 401