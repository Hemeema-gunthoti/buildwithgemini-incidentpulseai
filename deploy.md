# Deployment Guide: IncidentPulse AI

This document provides step-by-step instructions for deploying **IncidentPulse AI** across multiple container platforms and cloud environments.

---

## 📋 Prerequisites & Environment Variables

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Optional | `""` (Fallback to Sim Mode) | Google Gemini API key for live LLM reasoning (`gemini-2.5-flash` & `gemini-2.5-pro`). |
| `PORT` | Optional | `3000` (Container) / `3005` (Dev) | Port on which the unified Express server listens. |
| `NODE_ENV` | Optional | `production` | Set to `production` or `development`. |
| `FRONTEND_DIST` | Optional | `/app/frontend/dist` | File path to precompiled Vite assets. |

> **Offline Mode Note:** If `GEMINI_API_KEY` is not provided, IncidentPulse AI automatically boots into **High-Fidelity Simulation Mode**, generating token-streamed agent reasoning and realistic Mermaid diagrams out of the box with zero runtime errors.

---

## 🐳 1. Local Docker & Docker Compose

Deploy the complete application locally using Docker:

### Quick Start with Docker Compose
```bash
# Clone or navigate to the IncidentPulseAI directory
cd IncidentPulseAI

# Optional: export your Gemini API Key
export GEMINI_API_KEY="<your_api_key>"

# Build and start container in the background
docker compose up --build -d

# Check health and view logs
docker compose logs -f
```

The War-Room UI will be immediately accessible at:
```
http://localhost:3000
```

### Manual Docker Build & Run
```bash
# Build multi-stage image
docker build -t incidentpulse-ai:latest .

# Run container on port 3000
docker run -d \
  -p 3000:3000 \
  -e GEMINI_API_KEY="<your_api_key>" \
  --name incidentpulse-warroom \
  incidentpulse-ai:latest
```

---

## ☁️ 2. Google Cloud Run Deployment

Google Cloud Run offers a fully managed serverless container environment with native support for Server-Sent Events (SSE) and HTTP/2.

### Step 1: Authenticate and Set GCP Project
```bash
gcloud auth login
gcloud config set project YOUR_GCP_PROJECT_ID
```

### Step 2: Enable Required GCP APIs
```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com
```

### Step 3: Build & Push Container to Google Artifact Registry
```bash
# Create an Artifact Registry Docker repository
gcloud artifacts repositories create incidentpulse-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="IncidentPulse AI container repository"

# Build and submit container via Cloud Build
gcloud builds submit --tag us-central1-docker.pkg.dev/YOUR_GCP_PROJECT_ID/incidentpulse-repo/incidentpulse-ai:latest .
```

### Step 4: Deploy to Cloud Run
```bash
gcloud run deploy incidentpulse-ai \
  --image us-central1-docker.pkg.dev/YOUR_GCP_PROJECT_ID/incidentpulse-repo/incidentpulse-ai:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 1Gi \
  --cpu 1 \
  --timeout 3600 \
  --set-env-vars="NODE_ENV=production,GEMINI_API_KEY=YOUR_GEMINI_API_KEY"
```

> **SSE Keep-Alive Setting:** The `--timeout 3600` flag ensures the Server-Sent Events (SSE) stream remains connected for active war-room monitoring sessions.

---

## 🚀 3. Render Deployment

Render can automatically build and deploy IncidentPulse AI using the repository's `Dockerfile`.

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository containing `IncidentPulseAI`.
3. Choose **Docker** as the Runtime environment.
4. Set the Root Directory to `IncidentPulseAI` (if deploying from a monorepo) or leave empty if the root is the project.
5. In **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
   - `GEMINI_API_KEY` = `your-api-key` (optional)
6. Click **Create Web Service**. Render will automatically execute the multi-stage Docker build and provide a public HTTPS URL (e.g., `https://incidentpulse-ai.onrender.com`).

---

## 🚂 4. Railway Deployment

Railway offers zero-configuration container deployments directly from GitHub.

1. Navigate to [Railway](https://railway.app/) and select **New Project** -> **Deploy from GitHub repo**.
2. Select your repository.
3. In your project service settings:
   - Set **Build Command** / **Dockerfile Path**: `Dockerfile`
   - Set **Variables**:
     - `PORT` = `3000`
     - `GEMINI_API_KEY` = `your-gemini-api-key`
4. Click **Deploy**. Railway will build the multi-stage image, provision an HTTPS domain, and route SSE events with zero buffering.

---

## 🔍 Post-Deployment Verification Checklist

Once deployed, verify the installation by testing these endpoints:

1. **Health Check**:
   ```bash
   curl -i https://YOUR_DEPLOYED_URL/api/health
   ```
   *Expected Response:* HTTP 200 with JSON payload `{"status":"ok", "geminiLive": true/false}`.

2. **SSE Streaming Check**:
   ```bash
   curl -N https://YOUR_DEPLOYED_URL/api/stream
   ```
   *Expected Response:* Streaming event header `Content-Type: text/event-stream` followed by `: connected\n\n` and real-time metric events.

3. **Frontend UI**:
   Open `https://YOUR_DEPLOYED_URL` in any modern web browser to confirm the live telemetry charts, agent reasoning cards, and chaos simulator dock render crisply.
