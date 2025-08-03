# TryMe - Personal AI Assistant

A modern React application built with Vite, TypeScript, and Tailwind CSS.

## Project Structure

```
src/
├── assets/          # Static assets (images, icons, etc.)
├── components/      # Reusable React components
│   └── ui/         # UI components (buttons, inputs, etc.)
├── hooks/          # Custom React hooks
├── lib/            # Library configurations and utilities
├── pages/          # Page components (if using routing)
├── styles/         # Global styles and CSS modules
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── App.tsx         # Main application component
├── index.css       # Global styles
└── main.tsx        # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Build the application:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## Features

- Modern React with hooks
- TypeScript for type safety
- Tailwind CSS for styling
- Radix UI components for accessibility
- Dark mode support
- Responsive design
- ESLint for code quality
