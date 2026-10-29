# Arquitectura Distribuida: TuZonaMarket Frontend (Odoo ERP + Motor de Recomendaciones Externo)

---

## 1. Topología de Tres Servidores Desacoplados

Este repositorio contiene **únicamente la capa Frontend / Cliente Web** de TuZonaMarket. La solución global está distribuida en tres servidores independientes que se comunican a través de APIs REST/JSON:

```mermaid
flowchart TD
    subgraph S1["SERVIDOR 1: FRONTEND (Este Repositorio)"]
        UI["TuZonaMarket React 18 + Vite"]
        Store["Zustand Stores (Cart, Demo, Servers)"]
        Adapters["Service Adapters (DIP)"]
    end

    subgraph S2["SERVIDOR 2: ODOO ERP (Backend & Database)"]
        OdooModels["Modelos Odoo:<br/>product.template<br/>product.public.category<br/>stock.quant<br/>res.partner"]
        OdooAPI["Odoo REST / JSON-RPC Gateway"]
    end

    subgraph S3["SERVIDOR 3: MOTOR DE RECOMENDACIONES (Microservicio IA)"]
        RecModels["Embeddings & pgvector<br/>Filtrado Colaborativo<br/>Reglas de Co-ocurrencia (FBT)"]
        RecAPI["FastAPI / Flask REST Endpoints"]
    end

    UI --> Store
    Store --> Adapters
    Adapters -->|"HTTP GET /products, /categories<br/>(VITE_ODOO_API_URL)"| OdooAPI
    OdooAPI --> OdooModels
    Adapters -->|"HTTP GET /feed, /fbt<br/>HTTP POST /cart-complements<br/>(VITE_RECOMMENDATION_API_URL)"| RecAPI
    RecAPI --> RecModels
```

## 2. Inversión de Dependencias (DIP) y Contratos de Servicio

La interfaz gráfica no posee ninguna dependencia directa hacia la lógica interna de Odoo ni del recomendador. Consume interfaces abstractas:

- `IOdooService` (`src/types/odoo.ts`)
- `IRecommendationService` (`src/types/recommendations.ts`)
