from typing import Literal

from pydantic import BaseModel, Field


class ProductIn(BaseModel):
    name: str = Field(min_length=1)
    category: Literal["laptop", "phone"]
    price: float = Field(gt=0)
    specs: str = ""
    inStock: bool = True


class ProductOut(ProductIn):
    id: str