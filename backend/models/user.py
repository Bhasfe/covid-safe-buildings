from __future__ import annotations
from werkzeug.security import generate_password_hash, check_password_hash
from typing import NoReturn
from db import db


class UserModel(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    phone = db.Column(db.Integer)
    password_hash = db.Column(db.String(200))
    age = db.Column(db.Integer)
    pcr_result = db.Column(db.Boolean)
    had_covid = db.Column(db.Boolean)
    vac_dose = db.Column(db.Integer)
    role = db.Column(db.Integer)

    def __init__(self,
                 first_name,
                 last_name,
                 password,
                 email,
                 phone=None,
                 age=None,
                 pcr_result=False,
                 had_covid=False,
                 vac_dose=0,
                 role=3) -> None:
        self.first_name: str = first_name
        self.last_name: str = last_name
        self.set_password(password)
        self.email: str = email
        self.phone: str = phone
        self.role: int = role
        self.age: int = age
        self.pcr_result: bool = pcr_result
        self.had_covid: bool = had_covid
        self.vac_dose: int = vac_dose

    def __repr__(self) -> str:
        return "<User %r>" % self.email

    def set_password(self, password: str) -> NoReturn:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def json(self) -> dict:
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone": self.phone,
            "role": self.role,
            "age": self.age,
            "pcr_result": self.pcr_result,
            "had_covid": self.had_covid,
            "vac_dose": self.vac_dose
        }

    def save_to_db(self) -> NoReturn:
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self) -> NoReturn:
        db.session.delete(self)
        db.session.commit()

    def update(self, data: dict) -> NoReturn:
        for key, value in data.items():
            setattr(self, key, value)
        db.session.commit()

    @classmethod
    def find_by_email(cls, email: str):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def find_all(cls):
        return cls.query.all()

    @classmethod
    def get_role(cls, _id):
        return cls.query.filter_by(id=_id).first().role
