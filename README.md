<div align="center">

#  Arabic Vocabulary Learning Platform

An innovative, interactive platform for mastering Arabic vocabulary and conversation skills.

[Features](#features) • [Quick Start](#quick-start) • [Installation](#installation) • [Documentation](#documentation)

![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)

</div>

---

## 🔥 Live Demos

https://github.com/user-attachments/assets/d34df480-7a61-43ae-af53-433d850c5dbf

https://github.com/user-attachments/assets/8218eaa3-3a08-490a-adae-20e8d16cdc99



https://app.arcade.software/share/hAX8pAY7e1blGYiaqKbQ


https://vocabulary-learner-red.vercel.app/

</div>

---

</div>
---

## ✨ Features

### Core Functionality

- 📚 **Smart Vocabulary Management**
  - Personalized word lists
  - Spaced repetition learning
  - Progress tracking

- 🎯 **Interactive Learning**
  - Real-time pronunciation feedback
  - Writing practice with instant corrections
  - Contextual learning examples

- 🔄 **Adaptive Learning System**
  - Difficulty adjustment based on performance
  - Personalized study paths
  - Comprehensive progress analytics

### Technical Highlights

- 🛡️ Secure authentication system  
- 🎨 Customizable themes (Light/Dark)  
- 📱 Responsive design for all devices  
- ⚡ Optimized performance  
- 🔄 Real-time updates  

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd lang-portal
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🛠️ Installation

### Prerequisites

- Node.js (v16 or higher)  
- npm or yarn  
- Modern web browser  

### Environment Setup

Create `.env` file in root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_API_BASE_URL=your_api_url
```

Configure database:

```bash
npm run setup-db
```

---

## 📚 Documentation

### Tech Stack

#### Frontend

- React 18.3  
- TypeScript 5.5  
- Vite 5.4  
- Tailwind CSS 3.4  

#### State Management

- React Query 5.56  
- React Hook Form 7.53  

#### UI Components

- shadcn/ui  
- Radix UI primitives  

#### Database & Backend

- Supabase  
- RESTful APIs  

---

### Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── common/        # Shared components
│   ├── forms/         # Form-related components
│   └── layouts/       # Layout components
├── features/          # Feature-specific components
│   ├── auth/          # Authentication
│   ├── vocabulary/    # Vocabulary management
│   └── practice/      # Practice exercises
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── styles/            # Global styles
└── types/             # TypeScript definitions
```

---

## 📜 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Lint code
npm run test      # Run tests
```

---

## 🔧 Configuration

### Theme Customization

```ts
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { ... },
        secondary: { ... }
      }
    }
  }
}
```

### API Configuration

- Endpoint configuration in `src/config/api.ts`  
- Authentication setup in `src/lib/auth.ts`

---

## 📈 Performance

- Lighthouse Score: 95+  
- First Contentful Paint: < 1.5s  
- Time to Interactive: < 3.5s  
- Bundle Size: < 200KB (gzipped)

---

## 🔒 Security

- HTTPS enforced  
- XSS protection  
- CSRF protection  
- Input sanitization  
- Rate limiting  
- Security headers configured  

---

## 📱 Browser Support

- Chrome (last 2 versions)  
- Firefox (last 2 versions)  
- Safari (last 2 versions)  
- Edge (last 2 versions)  

---

## 🗺️ Roadmap

- [ ] Offline support  
- [ ] Voice recognition  
- [ ] Social learning features  
- [ ] AI-powered corrections  
- [ ] Advanced analytics  

---

## 📄 License

This project is licensed under the MIT License – see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Made with ❤️ by the Arabic Vocabulary Team

</div>
