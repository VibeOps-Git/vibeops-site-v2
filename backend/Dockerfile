FROM python:3.12-slim

# Fonts for good rendering fidelity. Add brand fonts if needed.
RUN apt-get update && apt-get install -y --no-install-recommends \
    fonts-dejavu fonts-liberation fonts-noto \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=5008
CMD ["gunicorn", "-b", "0.0.0.0:5008", "app:app"]
