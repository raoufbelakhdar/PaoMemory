# PAO Memory System

A modern, mobile-first web application for mastering the Person-Action-Object (PAO) memorization technique. Built with React, TypeScript, and Tailwind CSS v4 with a beautiful glass morphism design.

## 🚀 Features

- **🏠 Home Page**: Interactive PAO number input with story generation
- **➕ Create Page**: Build your custom PAO system with inline editing and image upload
- **🎮 Practice Page**: Multiple exercise modes:
  - Flashcards with modern card design
  - Combined Quiz Challenge with color-coded difficulty levels
  - Sequence Challenge for memory palace training  
  - Speed Training with ultra-fast timing (1+ seconds)
- **⚙️ Settings Page**: Theme toggle, CSV import/export, data management
- **🌙 Dark/Light Mode**: Automatic theme detection with manual toggle
- **📱 Mobile-First**: Optimized for mobile devices with responsive design
- **✨ Glass Morphism**: Beautiful translucent UI with backdrop blur effects

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4 with custom design system
- **Build Tool**: Vite
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Charts**: Recharts (for future analytics)

## 📋 Prerequisites

- Node.js 18+ (Download from [nodejs.org](https://nodejs.org/))
- npm or yarn package manager
- Git (for version control)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd pao-memorization-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The app will open automatically at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (Radix UI based)
│   ├── figma/           # Figma-specific components
│   ├── Header.tsx       # App header
│   ├── BottomNav.tsx    # Bottom navigation
│   ├── InputBar.tsx     # PAO number inputs
│   ├── StoryOutput.tsx  # Generated story display
│   ├── PAOCards.tsx     # PAO visualization cards
│   ├── CreatePage.tsx   # Custom PAO creation
│   ├── PracticePage.tsx # Practice exercises
│   └── SettingsPage.tsx # App settings
├── data/                # Static data
│   ├── pao-data.json    # Default PAO data
│   └── pao-data.ts      # TypeScript PAO data
├── styles/              # Global styles
│   └── globals.css      # Tailwind + custom CSS
├── App.tsx              # Main app component
└── main.tsx            # React entry point
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue spectrum (#2563eb)
- **PAO Colors**: 
  - Person: Rose/Pink (#f43f5e)
  - Action: Amber/Yellow (#f59e0b)
  - Object: Emerald/Green (#10b981)

### Glass Morphism Utilities
- `.glass` - Standard glass effect
- `.glass-strong` - Enhanced glass with more opacity
- `.nav-glass` - Navigation-specific glass
- `.story-glass` - Story output glass styling

### Responsive Breakpoints
- Mobile: < 640px (primary focus)
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🌐 Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login and deploy:
```bash
vercel login
vercel --prod
```

### Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist/` folder to Netlify
   - Drag & drop to [netlify.com](https://netlify.com)
   - Or use Netlify CLI

### GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json scripts:
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

3. Build and deploy:
```bash
npm run build
npm run deploy
```

### Docker

1. Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Build and run:
```bash
docker build -t pao-app .
docker run -p 80:80 pao-app
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create `.env.local` for local environment variables:

```env
VITE_APP_TITLE=PAO Memory System
VITE_API_URL=your-api-url-here
```

### Code Quality

- **ESLint**: Code linting with TypeScript support
- **TypeScript**: Strict type checking
- **Prettier**: Code formatting (recommended to add)

### Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions  
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

## 📱 PWA Features

The app includes Progressive Web App features:

- **Installable**: Can be installed on mobile devices
- **Offline Ready**: Service worker for offline functionality
- **App-like Experience**: Full-screen mobile experience
- **Theme Colors**: Matches system theme

## 🎯 Usage Guide

### Basic PAO Workflow

1. **Enter Numbers**: Input numbers 1-100 for Person, Action, Object
2. **View Story**: See generated memory story with color-coded elements
3. **Practice**: Use various exercise modes to reinforce memory
4. **Customize**: Create your own PAO elements in the Create page
5. **Settings**: Toggle themes, import/export data

### Exercise Modes

- **Flashcards**: Traditional card-based review
- **Quiz Challenge**: Mixed question types with difficulty levels
- **Sequence Challenge**: Practice longer number sequences
- **Speed Training**: Rapid-fire memory training

### Data Management

- **Local Storage**: All data saved locally in browser
- **CSV Export/Import**: Backup and share your PAO data
- **Custom Elements**: Add personalized PAO entries

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**: Clear node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

2. **Port Already in Use**: Change port in vite.config.ts
```typescript
server: {
  port: 3001, // Change port number
}
```

3. **TypeScript Errors**: Check tsconfig.json paths
4. **Styling Issues**: Verify Tailwind CSS v4 syntax

### Performance Optimization

- Images are lazy-loaded
- Components are code-split
- Tailwind CSS is purged in production
- Gzip compression enabled

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **PAO Method**: Tony Buzan's memory technique
- **Design Inspiration**: Modern glass morphism trends
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React icon library

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the code documentation

---

**Built with ❤️ for memory masters everywhere**