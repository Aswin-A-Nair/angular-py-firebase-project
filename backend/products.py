from fastapi import APIRouter, Depends

from auth import require_admin
from firebase import db
from schemas import ProductIn, ProductOut

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=list[ProductOut])
def list_products(user: dict = Depends(require_admin)):
    docs = db.collection("products").stream()
    return [ProductOut(id=d.id, **d.to_dict()) for d in docs]


@router.post("", response_model=ProductOut)
def add_product(product: ProductIn, user: dict = Depends(require_admin)):
    _, ref = db.collection("products").add(product.model_dump())
    return ProductOut(id=ref.id, **product.model_dump())