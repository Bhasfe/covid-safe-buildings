# Resource for building
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from models.building import BuildingModel
from flask import request

_building_parser_ = reqparse.RequestParser()
_building_parser_.add_argument(
    "name", type=str, required=True, help="Name cannot be left blank!"
)
_building_parser_.add_argument(
    "address", type=str, required=True, help="Password cannot be left blank!"
)
_building_parser_.add_argument(
    "building_type", type=str, required=False, help="First Name cannot be left blank!"
)


class Building(Resource):
    @classmethod
    @jwt_required
    def get(cls, building_id):
        building = BuildingModel.find_by_id(building_id)
        if building:
            return building.json()
        return {'message': 'Building not found'}, 404

    @classmethod
    @jwt_required
    def post(cls):
        data = request.get_json()
        if not data:
            return {'message': 'No input data provided'}, 400
        building = BuildingModel(**data)
        building.save_to_db()
        return building.json(), 201

    @classmethod
    @jwt_required
    def put(cls, building_id):
        data = _building_parser_.parse_args()
        building = BuildingModel.find_by_id(building_id)
        if not building:
            return {'message': 'Building not found'}, 404
        building.update(data)
        return building.json()

    @classmethod
    @jwt_required
    def delete(cls, building_id):
        building = BuildingModel.find_by_id(building_id)
        if not building:
            return {'message': 'Building not found'}, 404
        building.delete_from_db()
        return {'message': 'Building deleted'}, 200


class BuildingRegister(Resource):
    @classmethod
    @jwt_required
    def post(cls):
        data = _building_parser_.parse_args()
        if not data:
            return {'message': 'No input data provided'}, 400
        building = BuildingModel(**data)
        building.save_to_db()
        return building.json(), 201


class BuildingList(Resource):
    @jwt_required
    def get(self):
        return {'buildings': [building.json() for building in BuildingModel.query.all()]}

    @jwt_required
    def post(self):
        data = _building_parser_.parse_args()
        if not data:
            return {'message': 'No input data provided'}, 400

        building = BuildingModel(**data)
        building.save_to_db()
        return building.json(), 201
