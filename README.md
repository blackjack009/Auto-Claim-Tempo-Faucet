# Tempo Testnet Faucet Auto-Claimer

A full-stack web application designed to automate the process of claiming testnet tokens from the Tempo Testnet Faucet. This tool allows users to claim tokens manually or set up an automated loop to claim tokens periodically.

## Features

- **Manual Claim**: Claim tokens for a specific wallet address with a single click.
- **Auto-Claim Loop**: Automatically requests funds every 10 seconds (configurable).
- **Real-Time Logs**: View a live feed of claim attempts, successful transaction hashes, and errors.
- **Secure Proxy**: Uses a Node.js/Express backend to proxy requests to the Tempo RPC, avoiding CORS issues.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Deployment**: Vercel ready

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/tempo-faucet-bot.git
cd tempo-faucet-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Locally

To run both the frontend and backend concurrently:

```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3002

## Project Structure

```
├── api/                # Backend API (Express)
│   ├── routes/         # API routes
│   └── app.ts          # App entry point
├── src/                # Frontend Source (React)
│   ├── components/     # React components
│   ├── pages/          # Page components
│   └── App.tsx         # Main App component
└── package.json        # Project dependencies and scripts
```

## API Endpoints

### `POST /api/faucet/claim`

Requests funds from the Tempo Testnet faucet.

**Request Body:**
```json
{
  "address": "0xYourWalletAddress..."
}
```

**Response:**
```json
{
  "success": true,
  "result": "0xTransactionHash..."
}
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Disclaimer

This tool is for educational and testing purposes only. Please use the faucet responsibly and respect any rate limits imposed by the Tempo network.
