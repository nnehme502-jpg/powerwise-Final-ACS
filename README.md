# PowerWise – Smart Home Energy Monitoring & Optimization System

## Overview
PowerWise is a full-stack smart energy monitoring web application developed for the Advances in Computer Science course.

The system simulates household electricity consumption, allowing users to manage rooms and devices, monitor energy usage, receive alerts, and visualize analytics through an interactive dashboard.

The project combines a modern React frontend with a NestJS backend, PostgreSQL database, GraphQL integration, JWT authentication, and real-time updates using Socket.IO.

---

# Main Features

## Authentication & Security
- User registration and login
- JWT-based authentication
- Protected API routes using NestJS Auth Guards
- Persistent login using localStorage tokens

---

## Room Management
Users can:
- Create rooms
- View all rooms
- Update room names
- Delete rooms

Examples:
- Kitchen
- Bedroom
- Living Room

---

## Device Management
Users can manage household devices including:
- Refrigerators
- Air Conditioners
- Televisions
- Washing Machines
- Heaters
- Lighting systems

Each device stores:
- Device name
- Device type
- Power rating (Watts)
- Average daily usage hours
- Status

---

## Energy Simulation
The system simulates electricity usage using device specifications.

Example formula:

Energy (kWh) = Power Rating × Usage Hours ÷ 1000

Example:

1200W × 3 hours ÷ 1000 = 3.6 kWh/day

The backend calculates:
- Total energy consumption
- Estimated electricity cost
- Total device runtime

---

## Dashboard Analytics
The dashboard provides:
- Total energy consumption
- Estimated daily electricity cost
- Device usage analytics
- Room-based energy distribution
- Interactive charts and graphs

Charts include:
- Energy trend charts
- Device pie charts
- Room comparison bar charts

---

## Alerts System
The system automatically generates alerts for:
- High energy consumption
- Devices exceeding thresholds
- Potential energy waste

Example:
"Fridge is consuming 3.6 kWh per day."

---

## Real-Time Updates (Socket.IO)
PowerWise uses Socket.IO for live updates.

Features:
- Instant dashboard refresh
- Real-time alerts
- Live synchronization between backend and frontend

Workflow:

Device Created
↓
Backend emits socket event
↓
Frontend receives event
↓
Dashboard updates automatically

---

# Technologies Used

## Frontend
- React
- React Router DOM
- Redux Toolkit
- Axios
- Recharts
- Socket.IO Client

---

## Backend
- NestJS
- TypeScript
- REST API
- GraphQL
- JWT Authentication
- Socket.IO

---

## Database
- PostgreSQL

---

# System Architecture

React Frontend
↓
Axios / GraphQL Requests
↓
NestJS Controllers
↓
NestJS Services
↓
PostgreSQL Database
↓
Response Returned to Frontend
↓
React State Updates UI

---

# Authentication Flow

User Login
↓
Backend validates credentials
↓
JWT token generated
↓
Frontend stores token
↓
Axios interceptor sends Bearer token
↓
NestJS AuthGuard verifies token
↓
Protected routes become accessible

---

# Socket.IO Flow

Frontend joins user socket room
↓
Backend emits live events
↓
Frontend listens for updates
↓
Dashboard refreshes automatically

---

# Database Tables

Main tables include:
- users
- rooms
- devices
- alerts

---

# API Structure

## REST Endpoints

POST   /api/auth/login
POST   /api/auth/register

GET    /api/rooms
POST   /api/rooms

GET    /api/devices
POST   /api/devices

GET    /api/dashboard/summary

GET    /api/alerts
DELETE /api/alerts/:id

---

## GraphQL

GraphQL is used for dashboard-related queries and analytics.

GraphQL endpoint:

http://localhost:3000/graphql

---

# Real-Time Communication

Implemented using:
- NestJS WebSocket Gateway
- Socket.IO


---

# Swagger API Documentation

Swagger documentation is available at:

http://localhost:3000/api
