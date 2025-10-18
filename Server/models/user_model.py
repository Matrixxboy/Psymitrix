
from sqlalchemy import create_engine, Column, Integer, String, JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(String(255), primary_key=True)
    name = Column(String(255))
    email = Column(String(255), unique=True)
    gender = Column(String(50))
    age = Column(Integer)
    older_siblings = Column(Integer)
    younger_siblings = Column(Integer)
    blood_group = Column(String(10))
    passwordHash = Column(String(255))
    avatarUrl = Column(String(255))
    preferences = Column(JSON)
    stats = Column(JSON)

    def __repr__(self):
        return f"<User(id='{self.id}', name='{self.name}', email='{self.email}')>"
