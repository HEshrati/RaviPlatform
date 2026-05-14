# Raavi Platform - Backend

Backend API for Raavi Platform built with NestJS and TypeORM.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14

## Installation

### 1. Install dependencies

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit the environment variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=raavi_db
JWT_SECRET=your_secret_key_minimum_32_characters
```

### 3. Database Setup

```bash
# Create database
createdb raavi_db

# Run migrations
npm run migration:run
```

### 4. Run the application

#### Development mode
```bash
npm run start:dev
```

#### Production mode
```bash
npm run build
npm run start:prod
```

API will be available at `http://localhost:3000`

## Available Scripts

- `npm run build` - Build the project
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with watch
- `npm run start:prod` - Start in production mode

## Project Structure

```
backend/
├── src/
│   ├── app.module.ts          # Main module
│   ├── main.ts                # Application entry point
│   ├── data-source.ts         # TypeORM configuration
│   ├── common/                # Shared components
│   │   ├── decorators/        # Custom decorators
│   │   ├── filters/           # Exception filters
│   │   ├── guards/            # Auth guards
│   │   └── interceptors/      # Interceptors
│   ├── config/                # Configuration files
│   ├── database/              # Database setup
│   │   ├── entities/          # TypeORM entities
│   │   └── migrations/        # Database migrations
│   └── modules/               # Application modules
│       ├── auth/              # Authentication
│       ├── users/             # User management
│       ├── events/            # Event management
│       └── ...
├── uploads/                   # Uploaded files
├── test/                      # Tests
├── package.json
├── tsconfig.json
└── README.md
```

## Common Issues

### TypeScript rootDir Error

If you encounter:
```
File is not under 'rootDir'. 'rootDir' is expected to contain all source files.
```

Make sure your `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "uploads", "test", "docs"]
}
```

### Database Connection Issues

1. Ensure PostgreSQL is running
2. Check your `.env` configuration
3. Verify database permissions

## License

MIT
