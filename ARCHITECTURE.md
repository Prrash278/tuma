# Tuma System Architecture

## High-Level Architecture

```mermaid
graph TB
    subgraph "Frontend (Next.js + React)"
        A[User Interface] --> B[Auth Components]
        A --> C[Dashboard]
        A --> D[Wallet Management]
        A --> E[Model Selector]
        A --> F[Usage History]
    end
    
    subgraph "Backend (Supabase)"
        G[Supabase Auth] --> H[Database]
        I[Edge Functions] --> H
        J[Realtime] --> H
        K[Row Level Security] --> H
    end
    
    subgraph "External Services"
        L[OpenRouter API] --> M[LLM Providers]
        N[Payment Providers] --> O[Stripe/Flutterwave/Paystack]
        P[FX Rate APIs] --> Q[Currency Conversion]
    end
    
    A --> G
    A --> I
    A --> J
    I --> L
    I --> N
    I --> P
    
    subgraph "Data Flow"
        R[User Request] --> S[Cost Estimation]
        S --> T[Wallet Check]
        T --> U[API Call to OpenRouter]
        U --> V[Update Wallet Balance]
        V --> W[Record Transaction]
        W --> X[Update Shadow USD Ledger]
    end
```

## Database Schema

```mermaid
erDiagram
    USERS ||--o{ WALLETS : has
    USERS ||--o{ TRANSACTIONS : makes
    USERS ||--o{ USAGE : generates
    USERS ||--o{ PAYMENT_INTENTS : creates
    
    WALLETS ||--o{ TRANSACTIONS : contains
    WALLETS {
        uuid id PK
        uuid user_id FK
        currency_type currency
        decimal balance
        decimal spending_cap
        spending_cap_type spending_cap_type
        timestamp created_at
        timestamp updated_at
    }
    
    MODELS ||--o{ USAGE : used_in
    MODELS {
        uuid id PK
        string name
        string provider
        decimal pricing_per_1k_tokens
        integer context_length
        boolean is_active
    }
    
    FX_RATES {
        uuid id PK
        currency_type from_currency
        currency_type to_currency
        decimal rate
        decimal markup_percentage
        decimal effective_rate
    }
    
    SHADOW_USD_LEDGER {
        uuid id PK
        decimal total_usd_consumed
        decimal total_usd_available
        timestamp last_updated
    }
```

## API Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant E as Edge Function
    participant D as Database
    participant O as OpenRouter
    participant P as Payment Provider
    
    U->>F: Select model & send message
    F->>E: POST /api/chat
    E->>D: Get user wallet & model pricing
    E->>D: Check balance & spending cap
    E->>O: Forward request to LLM
    O-->>E: Return response
    E->>D: Update wallet balance
    E->>D: Record transaction
    E->>D: Update usage stats
    E->>D: Update shadow USD ledger
    E-->>F: Return response + cost info
    F-->>U: Display response
    
    Note over U,P: Top-up Flow
    U->>F: Request wallet top-up
    F->>E: POST /api/wallet-management
    E->>P: Process payment
    P-->>E: Payment confirmation
    E->>D: Update wallet balance
    E->>D: Record transaction
    E-->>F: Success response
    F-->>U: Updated balance
```

## Security Model

```mermaid
graph TD
    A[User Authentication] --> B[JWT Token Validation]
    B --> C[Row Level Security]
    C --> D[User Data Isolation]
    D --> E[API Rate Limiting]
    E --> F[Spending Cap Enforcement]
    F --> G[Shadow USD Ledger Check]
    G --> H[OpenRouter Quota Management]
    
    I[Payment Security] --> J[PCI Compliance]
    J --> K[Webhook Validation]
    K --> L[Transaction Integrity]
    
    M[Data Protection] --> N[Encryption at Rest]
    N --> O[Encryption in Transit]
    O --> P[Audit Logging]
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Frontend (Vercel)"
        A[Next.js App] --> B[Static Assets]
        A --> C[Serverless Functions]
    end
    
    subgraph "Backend (Supabase)"
        D[Database] --> E[PostgreSQL]
        F[Edge Functions] --> G[Deno Runtime]
        H[Auth] --> I[JWT Management]
        J[Realtime] --> K[WebSocket Connections]
    end
    
    subgraph "External Services"
        L[OpenRouter] --> M[LLM APIs]
        N[Payment Gateways] --> O[Stripe/Flutterwave]
        P[FX APIs] --> Q[Currency Data]
    end
    
    A --> F
    A --> H
    A --> J
    F --> L
    F --> N
    F --> P
```

## Key Features Implementation

### 1. Multi-Currency Wallet System
- **Database**: Wallets table with currency support
- **FX Conversion**: Real-time rates with markup
- **Balance Management**: Atomic transactions with rollback

### 2. Post-Paid Model
- **Real-time Deduction**: Balance updated after each API call
- **Spending Caps**: User-defined limits enforced at API level
- **Cost Estimation**: Pre-call cost calculation

### 3. Shadow USD Ledger
- **Quota Management**: Track total USD consumption
- **OpenRouter Limits**: Prevent exceeding provider quotas
- **Reconciliation**: Compare with actual usage

### 4. Real-time Updates
- **Supabase Realtime**: Live wallet balance updates
- **WebSocket Connections**: Instant notifications
- **State Synchronization**: Frontend state management

### 5. Payment Integration
- **Multiple Providers**: Stripe, Flutterwave, Paystack
- **Webhook Handling**: Secure payment confirmation
- **Transaction Recording**: Complete audit trail

## Performance Considerations

- **Edge Functions**: Global distribution for low latency
- **Database Indexing**: Optimized queries for wallet operations
- **Caching**: FX rates and model pricing cached
- **Rate Limiting**: Prevent abuse and ensure fair usage
- **Connection Pooling**: Efficient database connections

## Monitoring & Observability

- **Supabase Dashboard**: Database and function monitoring
- **Error Tracking**: Comprehensive error logging
- **Usage Analytics**: Real-time usage metrics
- **Performance Metrics**: API response times
- **Alerting**: Automated alerts for critical issues
