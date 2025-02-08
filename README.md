# BARK Dashboard and Chat Application  
**v0.1.0-beta**

BARK is a Next.js–based dashboard and chat application built for the Solana blockchain. It combines real-time portfolio tracking, interactive charts, and AI-powered insights to elevate your decentralized finance (DeFi) experience.

---

## Overview

BARK transforms how you interact with the Solana ecosystem by offering:

- **AI-Driven Assistance & Chat**: Communicate with our AI agent to get instant insights and smart trade recommendations.
- **Seamless Token Trading**: Execute token trades with confidence using AI-powered analysis that fetches and compares real-time data from Jupiter and Raydium decentralized exchanges.
- **Comprehensive Dashboard**: Monitor your portfolio and market trends with an intuitive, responsive interface built with Next.js and Shadcn UI.

*Note: All API endpoints—including those for add API functions, cron jobs, chat interactions, and wallet/portfolio operations—are organized as `route.ts` files within their respective directories for consistency and maintainability.*

---

## Features

- **Real-Time Portfolio Tracking**  
  Stay up-to-date with live data and interactive charts displaying your Solana assets.

- **AI-Powered Insights**  
  Leverage our integrated chat interface to receive actionable market insights and trading advice.

- **Intuitive Token Trading**  
  Select tokens easily from a dynamically populated dropdown and execute trades backed by real-time price analysis from both Jupiter and Raydium.

- **Responsive & User-Friendly Design**  
  Enjoy a seamless experience on any device, enhanced by robust user authentication and a clean, modern UI.

- **Secure Integration**  
  Protect your data with enhanced security features powered by Privy.

---

## Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** (v20 or later)
- A package manager such as **npm**, **pnpm**, or **yarn**
- **Solana CLI** (optional, for advanced blockchain interactions)

---

## Environment Configuration

Create a `.env.local` file in the project root and add the following variables:

```env
NEXT_PUBLIC_API_URL=<your-api-url>
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PRIVY_API_KEY=<your-privy-api-key>
OPENAI_API_KEY=<your-openai-api-key>
```

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/bark-protocol/ai-agent-dashboard.git
   cd ai-agent-dashboard
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   # or
   yarn install
   ```

3. **Start the development server:**

   ```bash
   pnpm run dev
   # or
   yarn dev
   ```

4. **Open your browser:**

   Visit [http://localhost:3000](http://localhost:3000) to see the application in action.

---

## API Endpoints & Project Structure

The application interacts with key endpoints such as:

- **`/api/jupiter`**: Retrieves price data from the Jupiter DEX.
- **`/api/raydium`**: Retrieves price data from the Raydium DEX.

In addition, all other API functionalities (including add API functions, cron jobs, chat, and wallet/portfolio operations) are implemented via a standardized `route.ts` file in their respective directories. This unified approach simplifies maintenance and enhances consistency across the project.

---

## Technologies Used

- **React**: For building the user interface.
- **Next.js**: For server-side rendering and routing.
- **Shadcn UI**: For a modern, component-based design.
- **Tailwind CSS**: For utility-first styling.
- **Sonner**: For toast notifications.
- **Lucide Icons**: For contemporary UI icons.
- **Privy**: For enhanced security and data privacy.
- **OpenAI**: For AI-powered insights and recommendations.

---

## How It Works

1. **Token Selection**:  
   Choose input and output tokens from a dropdown populated with up-to-date token metadata.

2. **Price Fetching**:  
   Retrieve real-time pricing data from Jupiter and Raydium APIs.

3. **AI Analysis**:  
   The integrated AI analyzes the price data to determine the most favorable trading option.

4. **Trade Execution**:  
   Execute the trade with a single click, receiving immediate feedback through user notifications.

---

## Contributing

Contributions are welcome! To get involved:

1. **Fork the repository.**
2. **Create a new branch:**

   ```bash
   git checkout -b feature/your-feature
   ```

3. **Commit your changes:**

   ```bash
   git commit -m "Describe your feature or fix"
   ```

4. **Push your branch:**

   ```bash
   git push origin feature/your-feature
   ```

5. **Open a pull request** with a clear description of your changes.

---

## License

This project is licensed under the [MIT License](LICENSE).
