from fastapi import FastAPI
from .input import read_data

app = FastAPI(debug=True)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/api/v1/data')
async def data():
    return { "data": read_data() }
