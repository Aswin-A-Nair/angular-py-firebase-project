from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import products

app = FastAPI(title="ShopEasy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)


@app.get("/")
def health():
    return {"status": "ok"}