# Trade Credit Score

A comprehensive solution for managing contacts, invoices, payments, and calculating trade credit scores.

## Project Structure

- `backend`: NestJS application (API, Jobs, Database).
- `mobile`: React Native (Expo) application.

## Prerequisites

- Node.js (v18+)
- MongoDB (running locally or via Docker)
- Redis (for Jobs/Queues)
- CocoaPods (for iOS)
- Android Studio (optional, for Android Emulator)

## Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment:
    - Ensure MongoDB is running on `mongodb://localhost:27017/trade-credit-score` (default).
    - Ensure Redis is running on `localhost:6379`.
4.  Run the server:
    ```bash
    npm run start:dev
    ```
    API will be available at `http://localhost:3000`.

### Backend Features
- **Auth**: OTP-based login (Stub OTP: `123456`).
- **Invoices**: Create, list, payment management.
- **Trust Score**: Automated job to calc credit scores.
- **Reminders**: Scheduled job for due invoices.

## Mobile App Setup

1.  Navigate to the mobile directory:
    ```bash
    cd mobile
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Important**: Update API Configuration
    - Open `src/api/client.ts`.
    - Update `localIp` to your machine's local IP address (e.g., `192.168.1.X`) to allow physical devices to connect.
4.  Run the app:
    ```bash
    npx expo start -c
    ```
    - Press `i` for iOS Simulator.
    - Scan QR code for Android (Expo Go).

## Testing

### E2E Tests (Backend)
```bash
cd backend
npm run test:e2e
```
Uses in-memory MongoDB for isolated testing.

## License
[License Name]
