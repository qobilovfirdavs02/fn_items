from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import Base, engine, get_db
from sqlalchemy import Column, Integer, String, Boolean

# Bazani yaratish (agar mavjud bo'lmasa)
Base.metadata.create_all(bind=engine)

# FastAPI ilovasini yaratish
app = FastAPI()

# CORS sozlamalari
origins = [
    "http://localhost:3000",  # Frontend ilovasi uchun
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SQLAlchemy uchun ORM modeli
class ItemDB(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), index=True)
    description = Column(String(200))
    price = Column(Integer)
    on_offer = Column(Boolean, default=False)

# Pydantic modeli
class Item(BaseModel):
    id: int
    name: str
    description: str
    price: float
    on_offer: bool = False

    class Config:
        orm_mode = True

# Endpoint: Barcha itemlarni olish
@app.get("/items", response_model=list[Item])
def get_items(db: Session = Depends(get_db)):
    items = db.query(ItemDB).all()
    return items

# Endpoint: Bitta itemni olish
@app.get("/items/{item_id}", response_model=Item)
def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(ItemDB).filter(ItemDB.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

# Endpoint: Yangi item yaratish
@app.post("/items", response_model=Item)
def create_item(item: Item, db: Session = Depends(get_db)):
    db_item = ItemDB(
        id=item.id,
        name=item.name,
        description=item.description,
        price=item.price,
        on_offer=item.on_offer,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# Endpoint: Itemni yangilash
@app.put("/items/{item_id}", response_model=Item)
def update_item(item_id: int, item: Item, db: Session = Depends(get_db)):
    db_item = db.query(ItemDB).filter(ItemDB.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db_item.name = item.name
    db_item.description = item.description
    db_item.price = item.price
    db_item.on_offer = item.on_offer
    db.commit()
    db.refresh(db_item)
    return db_item

# Endpoint: Itemni o'chirish
@app.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(ItemDB).filter(ItemDB.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return {"message": "Item deleted"}

# Endpoint: Faqatgina narxi past bo'lgan itemlarni ko'rsatish
@app.get("/show-items", response_model=list[Item])
def show_items(max_price: float = 1000.0, db: Session = Depends(get_db)):
    items = db.query(ItemDB).filter(ItemDB.price <= max_price).all()
    return items
