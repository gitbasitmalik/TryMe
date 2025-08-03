# TryMe - AI Chat Application

A modern AI-powered chat application built with React, TypeScript, and OpenRouter API. Features a beautiful dark/light theme interface with real-time streaming responses.

## ✨ Features

- 🤖 **AI Chat Interface** - Powered by Qwen 3 Coder model
- 🌙 **Dark/Light Theme** - Beautiful theme switching with system preference support
- 💬 **Real-time Streaming** - See AI responses as they're generated
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 💾 **Conversation History** - Save and manage your chat conversations
- 🎨 **Modern UI** - Built with Tailwind CSS and Radix UI components
- ⚡ **Fast & Lightweight** - Built with Vite for optimal performance

## 🚀 Live Demo

[Deployed on Vercel](https://your-app-name.vercel.app)

## 🛠️ Tech Stack

- **React 18** - UI library with hooks
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **OpenRouter API** - AI model integration
- **Lucide React** - Beautiful icons

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/tryme-chat-app.git
   cd tryme-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   echo "VITE_OPENROUTER_API_KEY=your-api-key-here" > .env
   echo "VITE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1" >> .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/      # React components
│   ├── ui/         # UI components (buttons, inputs, etc.)
│   └── theme-provider.tsx
├── hooks/          # Custom React hooks
│   ├── useChat.ts  # Chat functionality
│   └── useLocalStorage.ts
├── lib/            # API and utilities
│   └── api.ts      # OpenRouter API integration
├── types/          # TypeScript definitions
└── App.tsx         # Main application
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_OPENROUTER_API_KEY=your-openrouter-api-key
VITE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

### Other Platforms

- **Netlify** - Drag and drop the `dist` folder
- **GitHub Pages** - Enable Pages in repository settings
- **Firebase Hosting** - Use Firebase CLI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## �� License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai) for AI model access
- [Radix UI](https://radix-ui.com) for accessible components
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Vite](https://vitejs.dev) for the build tool

---

Made with ❤️ by [Your Name]
