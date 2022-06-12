from utils.calculations import Calculations
from typing import Iterable
from typing import NoReturn
from db import db


class CameraModel(db.Model):
    __tablename__ = 'cameras'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ip_address = db.Column(db.String(80))
    building_id = db.Column(db.Integer, db.ForeignKey('buildings.id'))
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'))

    building = db.relationship('BuildingModel')
    room = db.relationship('RoomModel')

    def __init__(self, building_id, room_id, ip_address) -> None:
        self.building_id: int = building_id
        self.room_id: int = room_id
        self.ip_address: str = ip_address

    def __repr__(self):
        return '<Camera %r>' % self.id

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, data: dict) -> NoReturn:
        for key, value in data.items():
            setattr(self, key, value)
        db.session.commit()

    @classmethod
    def find_by_id(cls, _id: int):
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def find_all(cls) -> Iterable:
        return cls.query.all()

    @classmethod
    def find_by_building_type(cls, building_type: str) -> Iterable:
        return cls.query.filter_by(building_type=building_type).all()

    @classmethod
    def find_by_building_id(cls, building_id: int) -> Iterable:
        return cls.query.filter_by(building_id=building_id).all()

    def json(self) -> dict:
        return {
            "id": self.id,
            "ip_address": self.ip_address,
            "building_id": self.building_id,
            "room_id": self.room_id
        }
