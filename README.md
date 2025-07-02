# APOCALIPSSI 🤖📄

> **Plateforme d'analyse intelligente de documents avec IA**

APOCALIPSSI est une application web moderne qui permet d'uploader des documents PDF et de générer automatiquement des synthèses, points clés et suggestions d'actions grâce à l'intelligence artificielle Claude.

## ✨ Fonctionnalités

- 📤 **Upload de documents** - Interface drag & drop pour fichiers PDF
- 🤖 **Analyse IA** - Traitement automatique avec Claude AI
- 📊 **Dashboard** - Vue d'ensemble des documents et statistiques
- 🔍 **Recherche & filtres** - Recherche textuelle et filtres par catégorie
- 📋 **Détails enrichis** - Résumés, points clés et suggestions d'actions
- 🔐 **Authentification** - Système sécurisé avec JWT
- 📱 **Interface responsive** - Compatible mobile et desktop

## 🏗️ Stack Technique

### Frontend
- **React 18** + **TypeScript**
- **React Query** - Gestion d'état serveur
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icônes

### Backend
- **Fastify** + **TypeScript**
- **Prisma** - ORM pour PostgreSQL
- **JWT** - Authentification
- **Zod** - Validation des données
- **Loki + Grafana** - Logging

### Services Externes
- **Claude AI** - Analyse de documents
- **MinIO** - Stockage d'objets
- **MySQL** - Base de données

## 🚀 Installation Rapide

### Prérequis
- Node.js 18+
- pnpm (gestionnaire de paquets)
- Docker & Docker Compose
- Clé API Claude (Anthropic)

> **Note** : PostgreSQL et MinIO sont lancés automatiquement via Docker

### 1. Clone du projet
```bash
git clone https://github.com/biholo/apocalipssi.git
cd apocalipssi
```

### 2. Installation des dépendances
```bash
# À la racine du projet
pnpm i
```

### 3. Configuration de l'environnement

**Backend (.env)**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/apocalipssi"

# JWT
JWT_SECRET="votre-secret-jwt-super-securise"
JWT_EXPIRES_IN="7d"

# Claude AI
CLAUDE_API_KEY="votre-cle-claude-ai"

# MinIO
MINIO_ENDPOINT="localhost"
MINIO_PORT=9000
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET_NAME="apocalipssi-docs"

# App
PORT=3001
NODE_ENV="development"
```

**Frontend (.env)**
```env
REACT_APP_API_URL="http://localhost:3001"
```

### 4. Lancement des services Docker
```bash
# Lancer tous les services (PostgreSQL, MinIO, etc.)
cd docker
docker compose up -d --build
```

### 5. Configuration de la base de données
```bash
# Générer les types Prisma
cd backend
pnpm prisma:generate

# Appliquer les migrations
pnpm prisma:migrate
```

### 6. Lancement du frontend et baclend depuis la racine
```bash
# /
pnpm run dev
```

### 7. Accès à l'application
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3001
- **MinIO Console** : http://localhost:9001
- **MySQL** : localhost:5432

### 8. Arrêt des services
```bash
# Arrêter tous les services Docker
cd docker
docker compose down

# Ou pour supprimer également les volumes
docker compose down -v
```

## 📖 Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Changelog](docs/CHANGELOG.md)


## 🧪 Tests

```bash
# Backend
cd backend && pnpm test

# Frontend
cd frontend && pnpm test
```

---

**Développé avec ❤️ en utilisant les dernières technologies**
