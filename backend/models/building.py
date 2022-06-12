from typing import NoReturn
from db import db


class BuildingModel(db.Model):
    __tablename__ = 'buildings'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80))
    address = db.Column(db.String(200))
    building_type = db.Column(db.String(80))
    safety_level = db.Column(db.Float)

    rooms = db.relationship('RoomModel', lazy='dynamic')

    def __init__(self, name, address, building_type) -> None:
        self.name: str = name
        self.address: str = address
        self.building_type: str = building_type
        self.safety_level: float = 100

    def __repr__(self):
        return '<Building %r>' % self.id

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
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def find_all(cls):
        return cls.query.all()

    @classmethod
    def find_by_name(cls, name):
        return cls.query.filter_by(name=name).first()

    @classmethod
    def find_by_address(cls, address):
        return cls.query.filter_by(address=address).first()

    @classmethod
    def find_by_building_type(cls, building_type):
        return cls.query.filter_by(building_type=building_type).all()

    def json(self):
        return {
            "id": self.id,
            "name": self.name,
            "address": self.address,
            "building_type": self.building_type,
            "safety_level": sum([room.json()["safety_level"] for room in self.rooms.all()]) / len(self.rooms.all()) if len(self.rooms.all()) != 0 else 0,
            "rooms": [room.json() for room in self.rooms.all()]
        }
