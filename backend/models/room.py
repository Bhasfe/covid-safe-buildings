from __future__ import annotations
from utils.calculations import Calculations
from typing import Iterable, NoReturn
from db import db


class RoomModel(db.Model):
    __tablename__ = 'rooms'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80))
    description = db.Column(db.String(200))
    capacity = db.Column(db.Integer)
    area = db.Column(db.Float)
    occupancy = db.Column(db.Integer)
    safety_level = db.Column(db.Float)
    num_of_people_masked_with_pcr_positive = db.Column(db.Integer)
    num_of_people_non_masked_with_pcr_positive = db.Column(db.Integer)
    num_of_people_masked_with_pcr_negative = db.Column(db.Integer)
    num_of_people_non_masked_with_pcr_negative = db.Column(db.Integer)
    num_of_people_vaccinated = db.Column(db.Integer)
    num_of_people_non_vaccinated = db.Column(db.Integer)

    building_id = db.Column(db.Integer, db.ForeignKey('buildings.id'))
    building = db.relationship('BuildingModel')

    cameras = db.relationship('CameraModel')

    def __init__(self, name, description, area, building_id):
        self.name: str = name
        self.description: str = description
        self.area: float | int = area
        self.building_id: int = building_id
        self.capacity: int = Calculations.calculate_capacity(area)
        self.occupancy: int = 0
        self.safety_level: int = 100
        self.num_of_people_masked_with_pcr_positive: int = 0
        self.num_of_people_non_masked_with_pcr_positive: int = 0
        self.num_of_people_masked_with_pcr_negative: int = 0
        self.num_of_people_non_masked_with_pcr_negative: int = 0
        self.num_of_people_vaccinated: int = 0
        self.num_of_people_non_vaccinated: int = 0

    def __repr__(self) -> str:
        return '<Room %r>' % self.id

    def save_to_db(self) -> NoReturn:
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self) -> NoReturn:
        db.session.delete(self)
        db.session.commit()

    def update(self, data: dict) -> NoReturn:
        safety_level = Calculations.calculate_safety_level(
            capacity=self.capacity,
            occupancy=self.occupancy,
            num_of_people_masked_with_pcr_positive=self.num_of_people_masked_with_pcr_positive,
            num_of_people_non_masked_with_pcr_positive=self.num_of_people_non_masked_with_pcr_positive,
            num_of_people_non_masked_with_pcr_negative=self.num_of_people_non_masked_with_pcr_negative,
            num_of_people_vaccinated=self.num_of_people_vaccinated,
            num_of_people_non_vaccinated=self.num_of_people_non_vaccinated
        )

        self.safety_level = safety_level

        for key, value in data.items():
            print("Settings key: " + key + " value: " + str(value))
            setattr(self, key, value)
        db.session.commit()

    @classmethod
    def find_by_id(cls, _id: int):
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def find_all(cls) -> Iterable:
        return cls.query.all()

    @classmethod
    def find_by_building_id(cls, building_id: int) -> Iterable:
        return cls.query.filter_by(building_id=building_id).all()

    def json(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "area": self.area,
            "capacity": self.capacity,
            "occupancy": self.occupancy,
            "safety_level": self.safety_level,
            "num_of_people_masked_with_pcr_positive": self.num_of_people_masked_with_pcr_positive,
            "num_of_people_non_masked_with_pcr_positive": self.num_of_people_non_masked_with_pcr_positive,
            "num_of_people_masked_with_pcr_negative": self.num_of_people_masked_with_pcr_negative,
            "num_of_people_non_masked_with_pcr_negative": self.num_of_people_non_masked_with_pcr_negative,
            "num_of_people_vaccinated": self.num_of_people_vaccinated,
            "num_of_people_non_vaccinated": self.num_of_people_non_vaccinated,
            "building_id": self.building_id,
            "cameras": [camera.json() for camera in self.cameras]
        }
