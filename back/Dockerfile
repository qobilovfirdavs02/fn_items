# Base image
FROM python:3.9

# Ishchi katalogni o‘rnatamiz
WORKDIR /app

# Fayllarni konteynerga nusxalaymiz
COPY . .

# Kerakli kutubxonalarni o‘rnatamiz
RUN pip install --no-cache-dir -r requirements.txt

# Portni ochamiz
EXPOSE 8000

# FastAPI serverni ishga tushiramiz
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
