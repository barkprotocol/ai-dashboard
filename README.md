# BARK | AI Dashboard
v0.1.0-beta

Elevate your DeFi experience with BARK AI Agent & Chatbot. Harness the power of artificial intelligence to optimize your Solana investments, execute smart trades, and navigate the complexities of decentralized finance with unprecedented ease and precision.

## Dashboard Overview

The dashboard offers an intuitive interface for managing token trades, analyzing real-time price data, and gaining actionable insights powered by AI. Built with Next.js and Shadcn UI, it ensures a seamless and responsive user experience.

## AI Trading Agent

AI Trading Agent is a React-based application that allows users to execute token trades using AI-powered price analysis across two decentralized exchanges (Jupiter and Raydium). The application is built with Next.js and integrates with the Solana blockchain.

## Features

- **Dashboard Interface**: Intuitive, real-time trading insights at your fingertips.
- **Token Selection**: Users can select tokens to trade using a dropdown menu populated with token metadata.
- **Real-Time Price Analysis**: Fetches and compares prices from Jupiter and Raydium DEXs.
- **AI-Powered Insights**: Analyzes prices to choose the best trading option.
- **User Notifications**: Provides success or error feedback during the trading process.
- **Responsive Design**: Optimized for different screen sizes.
- **Privy Integration**: Enhances privacy and user data security with Privy.

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js (v18 or later)
- npm, pnpm, or yarn package manager
- Solana CLI (optional, for advanced blockchain interactions)

## Environment Variables

Create a `.env.local` file in the root directory and provide the following variables:

```
NEXT_PUBLIC_API_URL=<your-api-url>
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PRIVY_API_KEY=<your-privy-api-key>
OPENAI_API_KEY=<your-openai-api-key>
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/bark-protocol/ai-trading-dashboard.git
   cd ai-trading-dashboard
   ```

2. Install dependencies:

   ```bash
   pnpm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   pnpm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/). Follow these steps to deploy:

1. Push your code to a GitHub repository.
2. Link the repository to your Vercel account.
3. Set environment variables in the Vercel dashboard.
4. Deploy your project with one click.

## API Endpoints

The application interacts with the following endpoints:

- `/api/jupiter`: Fetches price data from Jupiter DEX.
- `/api/raydium`: Fetches price data from Raydium DEX.

## Technologies Used

- **React**: Component-based UI library.
- **Next.js**: Framework for server-side rendering and routing.
- **Shadcn UI**: Component library for building modern UIs.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Sonner**: For toast notifications.
- **Lucide Icons**: Modern icons for UI elements.
- **Privy**: Enhances privacy and user data security.
- **OpenAI**: Provides AI-driven insights for trading.

## How It Works

1. **Token Selection**: Users select input and output tokens.
2. **Price Fetching**: The app fetches token prices from Jupiter and Raydium APIs.
3. **AI Analysis**: Prices are analyzed to determine the best trading option.
4. **Trade Execution**: Users execute the trade with a single click.

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

