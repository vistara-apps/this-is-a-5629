# MemeWarpAI

![MemeWarpAI Logo](https://via.placeholder.com/200x200.png?text=MemeWarpAI)

Warp your images into viral memes with AI.

## Overview

MemeWarpAI is a web application that allows users to generate AI-powered memes from their images or popular templates, with easy social sharing. The application uses advanced AI to analyze images and generate witty, contextually relevant captions.

### Key Features

- **AI Caption Generation**: Upload an image or select a template, and let AI suggest witty captions based on the image content.
- **Image-to-Meme Transformation**: Transform any image into a meme with customizable text overlays.
- **Direct Social Sharing**: Share your creations directly to Twitter, Facebook, Instagram, and Farcaster with a single click.
- **User Dashboard**: Track your created memes, credit balance, and transaction history.
- **Micro-transaction Model**: Pay per meme generation with bulk purchase discounts.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn or npm
- Firebase account
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-5629.git
   cd this-is-a-5629
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
yarn build
# or
npm run build
```

## Architecture

MemeWarpAI is built with the following technologies:

- **Frontend**: React, Vite, Tailwind CSS
- **State Management**: React Context API
- **Authentication**: Firebase Authentication, Web3 wallet authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **AI Integration**: OpenAI API
- **Web3 Integration**: RainbowKit, wagmi
- **Payment Processing**: x402-axios

## Documentation

Detailed documentation is available in the `docs` directory:

- [API Documentation](docs/api.md)
- [Authentication](docs/authentication.md)
- [Payment System](docs/payment.md)
- [Third-Party Integrations](docs/third-party-integrations.md)

## Project Structure

```
memewarp-ai/
├── docs/                  # Documentation
├── public/                # Static assets
├── src/
│   ├── components/        # React components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── services/          # API and service integrations
│   ├── App.jsx            # Main App component
│   ├── index.css          # Global styles
│   └── main.jsx           # Entry point
├── .env                   # Environment variables (not in repo)
├── .gitignore             # Git ignore file
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.js         # Vite configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OpenAI](https://openai.com/) for the AI capabilities
- [Firebase](https://firebase.google.com/) for backend services
- [RainbowKit](https://www.rainbowkit.com/) for wallet integration
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for the build system

