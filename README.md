# 🏋️ AI-Powered Fitness Application | Spring Boot Microservices

A production-ready microservices-based fitness application powered by Google Gemini AI that delivers personalized fitness recommendations based on user activity data.

---

## 🧱 Tech Stack

| Category | Technologies |
|---|---|
| **Backend** | Java, Spring Boot, Spring Cloud |
| **Service Discovery** | Eureka Server |
| **API Gateway** | Spring Cloud Gateway |
| **Messaging** | Apache Kafka |
| **Security** | Keycloak, OAuth2, PKCE |
| **AI** | Google Gemini AI API |
| **Databases** | PostgreSQL, MongoDB |
| **Config** | Spring Cloud Config Server |
| **Frontend** | React |
| **DevOps** | Docker |

---

## 🏗️ Architecture Overview

```
React Frontend
      │
      ▼
Spring Cloud Gateway (9096)          ← Centralized routing + Security
      │
      ├──► User Service (9090)        ← PostgreSQL
      ├──► Activity Service (9091)    ← MongoDB  ──► Kafka (Producer)
      └──► AI Service (9093)          ← MongoDB  ◄── Kafka (Consumer)

Eureka Server                         ← Service Discovery
Config Server (9095)                  ← Centralized Configuration
Keycloak (9097)                       ← OAuth2 / PKCE Authentication
Kafka (9092)                          ← Async Communication
```

---

## 🔌 Service Port Reference

| Service | Port |
|---|---|
| User Service | `9090` |
| Activity Service | `9091` |
| Apache Kafka | `9092` |
| AI Service | `9093` |
| Config Server | `9095` |
| Gateway Service | `9096` |
| Keycloak | `9097` |

---

## ⚙️ Prerequisites

Make sure you have the following installed:

- Java 17+
- Maven 3.8+
- Docker
- Node.js (for React frontend)

---

## 🚀 Setup & Installation Guide

### Step 1 — Start Apache Kafka (Docker)

```bash
# Pull Kafka native image
docker pull apache/kafka-native:4.1.1

# Run Kafka container on port 9092
docker run -d -p 9092:9092 apache/kafka-native:4.1.1
```

Verify Kafka is running:
```bash
docker ps
```

---

### Step 2 — Start Keycloak (Docker)

```bash
docker run -d \
  -p 127.0.0.1:9097:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:26.5.2 start-dev
```

---

### Step 3 — Configure Keycloak

1. Open the Keycloak Admin Console:
   ```
   http://localhost:9097/admin/master/console/
   ```

2. Login with:
   - **Username:** `admin`
   - **Password:** `admin`

3. Create a new **Realm**:
   - Click **"Create Realm"**
   - **Realm name:** `fitness-app`
   - Click **Save**

4. Create **Users** inside the `fitness-app` realm:

   Navigate to: `fitness-app` realm → **Users** → **Add User**

   | Username | Password | Temporary |
   |---|---|---|
   | `user1` | `user1` | No |
   | `user2` | `user2` | No |

   > After creating each user, go to the **Credentials** tab to set the password and disable **Temporary**.

5. Create a **Client** for your application with **OAuth2 + PKCE** flow enabled.

---

### Step 4 — Configure AI Service Environment Variables

The AI Service requires the following environment variables to connect to Google Gemini AI:

```bash
# Set these in your system or IDE run configuration

export GEMINI_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
export GEMINI_KEY=your_google_gemini_api_key_here
```

**For IntelliJ IDEA:**
- Go to Run → Edit Configurations → AI Service
- Add Environment Variables: `GEMINI_URL` and `GEMINI_KEY`

**For application.yml (alternative):**
```yaml
gemini:
  url: ${GEMINI_URL}
  api:
    key: ${GEMINI_KEY}
```

---

### Step 5 — Run Microservices (In Order)

> ⚠️ **Important:** Services must be started in the following order to ensure proper registration and configuration loading.

#### 1. Config Server (Port 9095)
```bash
cd config-server
mvn spring-boot:run
```
Wait until you see: `Started ConfigServerApplication`

#### 2. Eureka Service Discovery
```bash
cd eureka-server
mvn spring-boot:run
```
Eureka Dashboard: `http://localhost:8761`

#### 3. Gateway Service (Port 9096)
```bash
cd gateway-service
mvn spring-boot:run
```

#### 4. AI Service (Port 9093)
```bash
cd ai-service
mvn spring-boot:run
```

#### 5. Activity Service (Port 9091)
```bash
cd activity-service
mvn spring-boot:run
```

#### 6. User Service (Port 9090)
```bash
cd user-service
mvn spring-boot:run
```

---

## 🔐 Authentication Flow

This application uses **OAuth2 with PKCE** (Proof Key for Code Exchange) via Keycloak.

```
Client (React) ──► Keycloak (9097) ──► Access Token
      │
      ▼
Gateway (9096) ── validates token ──► Microservices
```

All API requests must include a valid Bearer token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

---

## 📡 Key API Endpoints

All requests go through the **Gateway Service** on port `9096`.

| Method | Endpoint | Service | Description |
|---|---|---|---|
| `POST` | `/api/users/register` | User Service | Register a new user |
| `GET` | `/api/users/{id}` | User Service | Get user details |
| `POST` | `/api/activities` | Activity Service | Log a fitness activity |
| `GET` | `/api/activities/user/{userId}` | Activity Service | Get user activities |
| `GET` | `/api/recommendations/{userId}` | AI Service | Get AI fitness recommendations |

---

## 📨 Kafka Messaging

| Role | Service | Topic |
|---|---|---|
| **Producer** | Activity Service | `activity-events` |
| **Consumer** | AI Service | `activity-events` |

When a user logs an activity, the Activity Service publishes an event to Kafka. The AI Service consumes this event and generates a personalized fitness recommendation using Google Gemini AI.

---

## 🗄️ Database Strategy

This project follows the **database-per-service** pattern:

| Service | Database | Reason |
|---|---|---|
| User Service | MySQL | Relational user data |
| Activity Service | MongoDB | Flexible activity documents |
| AI Service | MongoDB | Unstructured AI recommendation data |

---

## 🐳 Docker Services Summary

| Service | Image | Port |
|---|---|---|
| Apache Kafka | `apache/kafka-native:4.1.1` | `9092` |
| Keycloak | `quay.io/keycloak/keycloak:26.5.2` | `9097` |

---

## 🛠️ Troubleshooting

**Services not registering with Eureka?**
- Ensure Config Server is fully started before other services
- Check `eureka.client.serviceUrl.defaultZone` in config files

**Kafka connection refused?**
- Verify Docker container is running: `docker ps`
- Check Kafka is listening on port `9092`

**Keycloak token errors?**
- Confirm the realm name is exactly `fitness-app`
- Verify users have passwords set with **Temporary** disabled
- Double-check client OAuth2/PKCE settings

**AI Service not generating recommendations?**
- Confirm `GEMINI_URL` and `GEMINI_KEY` environment variables are set
- Verify the Gemini API key is valid and has sufficient quota

---

## 📁 Project Structure

```
fitness-app/
├── config-server/          # Spring Cloud Config Server
├── eureka-server/          # Service Discovery
├── gateway-service/        # API Gateway + Security
├── user-service/           # User Management (MySQL)
├── activity-service/       # Activity Tracking (MongoDB) + Kafka Producer
├── ai-service/             # AI Recommendations (MongoDB) + Kafka Consumer
└── frontend/               # React Frontend
```

---

## 👨‍💻 Author

**Built with:** Java • Spring Boot • Spring Cloud • Kafka • Keycloak • Google Gemini AI • Docker

> **Duration:** December 2025 – January 2026
