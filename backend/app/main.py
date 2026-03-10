from fastapi import FastAPI

app = FastAPI(title="DevSchool API")


@app.get("/health")
def health_check():
    return {"status": "ok"}
