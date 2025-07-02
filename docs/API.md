# Documentation API - APOCALIPSSI

## Vue d'ensemble

L'API APOCALIPSSI est une API REST qui permet de gérer l'upload et l'analyse de documents PDF avec intelligence artificielle.

**Base URL** : `http://localhost:3001/api`

**Authentication** : Bearer Token (JWT)

**Content-Type** : `application/json` (sauf upload de fichiers)

## Authentification

### Endpoints d'authentification

#### POST /auth/login
Connexion utilisateur

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "clr1k2j3k4l5m6n7o8p9",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Errors:**
- `400` - Données invalides
- `401` - Identifiants incorrects
- `429` - Trop de tentatives de connexion

#### POST /auth/register
Inscription utilisateur

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "message": "Utilisateur créé avec succès. Vérifiez votre email."
  }
}
```

#### POST /auth/verify-token
Vérification du token

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "user": {
      "id": "clr1k2j3k4l5m6n7o8p9",
      "email": "user@example.com"
    }
  }
}
```

## Gestion des Documents

### GET /documents
Récupérer tous les documents de l'utilisateur

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Numéro de page (défaut: 1)
- `limit` (optional): Nombre d'éléments par page (défaut: 10, max: 50)
- `search` (optional): Recherche textuelle dans le titre et contenu
- `category` (optional): Filtrer par catégorie
- `sortBy` (optional): Champ de tri (createdAt, title, category)
- `sortOrder` (optional): Ordre de tri (asc, desc)

**Example:**
```
GET /documents?page=1&limit=10&search=rapport&category=business&sortBy=createdAt&sortOrder=desc
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "clr1k2j3k4l5m6n7o8p9",
        "title": "Rapport Trimestriel Q1 2024",
        "category": "business",
        "summary": "Résumé du rapport trimestriel...",
        "fileUrl": "https://minio.example.com/documents/1234567890-rapport.pdf",
        "urlText": "https://example.com/view-online",
        "status": "PROCESSED",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:05:00.000Z",
        "keyPointsCount": 5,
        "suggestionsCount": 3
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    },
    "stats": {
      "totalDocuments": 25,
      "processedDocuments": 23,
      "pendingDocuments": 2,
      "categories": {
        "business": 10,
        "legal": 8,
        "technical": 7
      }
    }
  }
}
```

### GET /documents/:id
Récupérer un document spécifique

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clr1k2j3k4l5m6n7o8p9",
    "title": "Rapport Trimestriel Q1 2024",
    "category": "business",
    "summary": "Ce rapport présente les résultats financiers du premier trimestre 2024...",
    "content": "Contenu extracté du PDF...",
    "fileUrl": "https://minio.example.com/documents/1234567890-rapport.pdf",
    "urlText": "https://example.com/view-online",
    "status": "PROCESSED",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:05:00.000Z",
    "keyPoints": [
      {
        "id": "kp1",
        "title": "Croissance du chiffre d'affaires",
        "description": "Augmentation de 15% par rapport au trimestre précédent",
        "importance": "HIGH",
        "category": "FINANCIAL"
      },
      {
        "id": "kp2", 
        "title": "Réduction des coûts opérationnels",
        "description": "Optimisation des processus internes",
        "importance": "MEDIUM",
        "category": "OPERATIONAL"
      }
    ],
    "suggestions": [
      {
        "id": "as1",
        "title": "Investir dans le marketing digital",
        "description": "Augmenter la présence en ligne pour maintenir la croissance",
        "priority": "HIGH",
        "category": "MARKETING",
        "estimatedImpact": "Augmentation potentielle de 20% des leads"
      }
    ]
  }
}
```

**Errors:**
- `404` - Document non trouvé
- `403` - Accès non autorisé

### POST /documents/upload
Upload et analyse d'un document

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Fichier PDF (required, max 10MB)
- `title`: Titre du document (optional)
- `category`: Catégorie (optional)

**Example (curl):**
```bash
curl -X POST \
  -H "Authorization: Bearer {token}" \
  -F "file=@document.pdf" \
  -F "title=Mon Document" \
  -F "category=business" \
  http://localhost:3001/api/documents/upload
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clr1k2j3k4l5m6n7o8p9",
    "title": "Mon Document",
    "category": "business",
    "status": "PROCESSING",
    "fileUrl": "https://minio.example.com/documents/1234567890-document.pdf",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "message": "Document uploadé avec succès. L'analyse est en cours..."
  }
}
```

**Errors:**
- `400` - Fichier invalide ou manquant
- `413` - Fichier trop volumineux
- `415` - Type de fichier non supporté
- `500` - Erreur lors de l'upload ou de l'analyse

### PUT /documents/:id
Mettre à jour un document

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Nouveau titre",
  "category": "legal"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clr1k2j3k4l5m6n7o8p9",
    "title": "Nouveau titre",
    "category": "legal",
    "updatedAt": "2024-01-01T00:10:00.000Z"
  }
}
```

### DELETE /documents/:id
Supprimer un document

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Document supprimé avec succès"
  }
}
```

## Gestion des Utilisateurs

### GET /user/profile
Récupérer le profil utilisateur

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clr1k2j3k4l5m6n7o8p9",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "isActive": true,
    "emailVerified": true,
    "preferences": {
      "language": "fr",
      "notifications": true
    },
    "stats": {
      "documentsCount": 25,
      "totalStorageUsed": "125.5 MB"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT /user/profile
Mettre à jour le profil utilisateur

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "preferences": {
    "language": "en",
    "notifications": false
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clr1k2j3k4l5m6n7o8p9",
    "firstName": "Jane",
    "lastName": "Smith",
    "preferences": {
      "language": "en",
      "notifications": false
    },
    "updatedAt": "2024-01-01T00:15:00.000Z"
  }
}
```

## Codes d'Erreur Standards

### Format de Réponse d'Erreur

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Les données fournies sont invalides",
    "details": [
      {
        "field": "email",
        "message": "Format d'email invalide"
      }
    ],
    "timestamp": "2024-01-01T00:00:00.000Z",
    "path": "/api/auth/register"
  }
}
```

### Codes d'Erreur Spécifiques

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Données de requête invalides |
| `UNAUTHORIZED` | 401 | Token manquant ou invalide |
| `FORBIDDEN` | 403 | Accès interdit à la ressource |
| `NOT_FOUND` | 404 | Ressource non trouvée |
| `CONFLICT` | 409 | Conflit (ex: email déjà utilisé) |
| `PAYLOAD_TOO_LARGE` | 413 | Fichier trop volumineux |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | Type de fichier non supporté |
| `RATE_LIMIT_EXCEEDED` | 429 | Limite de taux dépassée |
| `INTERNAL_ERROR` | 500 | Erreur serveur interne |
| `SERVICE_UNAVAILABLE` | 503 | Service temporairement indisponible |

## Statuts des Documents

| Statut | Description |
|--------|-------------|
| `UPLOADING` | Upload en cours |
| `PROCESSING` | Analyse IA en cours |
| `PROCESSED` | Analyse terminée avec succès |
| `FAILED` | Erreur lors du traitement |
| `DELETED` | Document supprimé |

## Catégories de Documents

| Catégorie | Description |
|-----------|-------------|
| `business` | Documents d'affaires |
| `legal` | Documents juridiques |
| `technical` | Documentation technique |
| `financial` | Documents financiers |
| `medical` | Documents médicaux |
| `educational` | Documents éducatifs |
| `personal` | Documents personnels |
| `other` | Autres documents |

## Limites et Quotas

- **Taille max fichier** : 10 MB
- **Formats supportés** : PDF uniquement
- **Rate limiting** : 100 requêtes/minute par utilisateur
- **Upload quotidien** : 50 documents par jour
- **Stockage total** : 1 GB par utilisateur (plan gratuit)

## Webhooks (Futur)

### Configuration
```json
{
  "url": "https://your-app.com/webhooks/apocalipssi",
  "events": ["document.processed", "document.failed"],
  "secret": "webhook_secret"
}
```

### Événements
- `document.uploaded` - Document uploadé
- `document.processed` - Analyse terminée
- `document.failed` - Erreur de traitement
- `user.created` - Utilisateur créé

## SDK JavaScript (Exemple d'Usage)

```javascript
import { ApocalipssiClient } from '@apocalipssi/sdk';

const client = new ApocalipssiClient({
  baseURL: 'http://localhost:3001/api',
  token: 'your-jwt-token'
});

// Upload d'un document
const uploadResult = await client.documents.upload(file, {
  title: 'Mon Document',
  category: 'business'
});

// Récupération des documents
const documents = await client.documents.list({
  page: 1,
  limit: 10,
  search: 'rapport'
});

// Détail d'un document
const document = await client.documents.get(documentId);
```

---

Cette API offre une interface complète pour la gestion et l'analyse de documents avec IA dans APOCALIPSSI. 