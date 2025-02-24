# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker

# # MySQLga ulanish stringi
# # SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost:3306/items_db"


# # SQLAlchemy bazasi va sesiya konfiguratsiyasi
# engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"charset": "utf8mb4"})  # connect_args mysql'ni UTF-8 bilan sozlash
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# # ORM uchun bazaviy sinf
# Base = declarative_base()

# # Helper function for getting the DB session
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://myuser:mypassword@postgres:5432/mydatabase")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
