# Professional Portfolio Website with Admin Panel

A modern, responsive portfolio website for **Ir Rugendabanga Clovis**, featuring a comprehensive admin panel for content management. Built with React, TypeScript, Three.js, and Supabase.

## 🚀 Features

### Frontend Features
- **3D Hero Animation**: Interactive 3D scene with floating geometric shapes using React Three Fiber
- **Responsive Design**: Mobile-first approach with smooth animations and transitions
- **Dark/Light Mode**: Toggle between themes with persistent storage
- **Modern UI**: Glassmorphism effects, smooth micro-interactions, and professional design
- **Performance Optimized**: Lazy loading, code splitting, and optimized bundle size

### Admin Panel Features
- **Secure Authentication**: Email/password login with session management
- **Content Management**: Full CRUD operations for projects, experience, and about section
- **Real-time Updates**: Live data synchronization with Supabase
- **Analytics Dashboard**: Site statistics and visitor analytics
- **File Management**: Image upload and management capabilities

### Technical Features
- **Supabase Integration**: Complete backend with RLS policies and real-time subscriptions
- **TypeScript**: Full type safety throughout the application
- **Form Validation**: React Hook Form with Yup schema validation
- **State Management**: Zustand for global state management
- **SEO Optimized**: Meta tags and semantic HTML structure

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for development and building
- **Tailwind CSS** for styling
- **React Three Fiber** for 3D graphics
- **Framer Motion** for animations
- **React Router Dom** for routing
- **React Hook Form** for form handling
- **Zustand** for state management

### Backend
- **Supabase** for database and authentication
- **PostgreSQL** database with Row Level Security
- **Real-time subscriptions** for live updates

### Development Tools
- **ESLint** for code linting
- **TypeScript** for type checking
- **PostCSS** with Autoprefixer

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd portfolio-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Run the migration file in the Supabase SQL editor:
     ```sql
     -- Copy and paste the content from supabase/migrations/create_portfolio_schema.sql
     ```

4. **Environment setup**
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Start development server**
```bash
npm run dev
```

## 🔐 Admin Setup

### Creating Admin User

1. **Method 1: Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to Authentication > Users
   - Click "Add user" and create an admin account

2. **Method 2: Sign up via API** (if email confirmation is disabled)
   - Use the Supabase client to create a user programmatically
   - The demo login uses: `admin@example.com` / `password123`

### Admin Features

- **Dashboard**: Analytics overview with visitor statistics
- **Projects Management**: Add, edit, delete projects with image upload
- **Experience Management**: Manage work history and skills
- **About Section**: Update bio, skills, and contact information
- **Settings**: Site configuration and admin preferences

## 📱 Pages & Routes

### Public Routes
- `/` - Home page with 3D hero animation
- `/about` - About page with bio and skills
- `/experience` - Professional experience timeline
- `/projects` - Project portfolio with filtering
- `/contact` - Contact form and information

### Admin Routes (Protected)
- `/admin/login` - Admin authentication
- `/admin` - Analytics dashboard
- `/admin/projects` - Project management
- `/admin/experience` - Experience management
- `/admin/about` - About section management
- `/admin/settings` - Admin settings

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#2563eb, #3b82f6)
- **Secondary**: Purple (#7c3aed, #8b5cf6)
- **Accent**: Orange (#f59e0b, #f97316)
- **Success**: Green (#10b981, #22c55e)
- **Warning**: Yellow (#f59e0b, #fbbf24)
- **Error**: Red (#ef4444, #f87171)

### Typography
- **Headings**: Inter font family with proper line heights
- **Body**: Optimized line spacing (150% for body, 120% for headings)
- **Weight System**: 3 font weights maximum (regular, medium, bold)

### Responsive Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+
- **Large Desktop**: 1440px+

## 🗄️ Database Schema

### Tables
1. **projects**
   - id, title, description, tech_stack[], image_url, demo_url, repo_url, category, created_at, updated_at

2. **experience** 
   - id, company, position, duration, description, skills[], created_at

3. **about**
   - id, bio, skills[], contact_info (JSON), resume_url, updated_at

### Security
- Row Level Security (RLS) enabled on all tables
- Public read access for anonymous users
- Full access for authenticated admin users
- Secure authentication with Supabase Auth

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Netlify/Vercel
1. Connect your repository to your deployment platform
2. Set environment variables in the deployment settings
3. Build command: `npm run build`
4. Output directory: `dist`

## 📈 Performance Optimizations

## 🔒 Deployment / Environment Variables (CRITICAL)

### Required Environment Variables

The app requires Supabase configuration to be present in the environment where it runs (both locally and in Vercel):

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key
```

### Vercel Deployment Instructions

**IMPORTANT**: Environment variables in Vite apps are baked into the bundle at build time. If you add or update environment variables in Vercel, you MUST redeploy with a fresh build.

#### Steps to Configure Vercel:

1. **Set Environment Variables**:
   - Go to your Vercel project dashboard
   - Navigate to: **Settings** → **Environment Variables**
   - Add the following variables:
     - `VITE_SUPABASE_URL` = `https://your-project-ref.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `your_anon_key`
   - Environment: Select **"Production"** or **"All Environments"**
   - Click **Save**

2. **Trigger Fresh Deployment** (CRITICAL STEP):
   - Go to the **Deployments** tab
   - Click on your most recent deployment
   - Click the **three dots menu** (•••)
   - Select **"Redeploy"**
   - **UNCHECK** "Use existing Build Cache"
   - Click **"Redeploy"**

3. **Verify Configuration**:
   - After deployment completes, visit your site
   - Open browser DevTools Console (F12)
   - Check for "Supabase Configuration Status" log
   - It should show `configured: true`

### Troubleshooting

**Problem**: Projects page shows "Loading projects is taking longer than expected" or "Database connection not configured"

**Cause**: Environment variables are not loaded in the production build

**Solution**:
1. Verify environment variables are saved in Vercel settings
2. Redeploy WITHOUT using build cache
3. Environment variables must exist BEFORE the build starts
4. Check browser console for configuration status logs

**Problem**: "Cannot connect to database" error

**Possible Causes**:
- Supabase project is paused or deleted
- Invalid API keys
- CORS issues (check Supabase dashboard for allowed origins)
- Network connectivity issues

**Debug Steps**:
1. Open browser DevTools Console
2. Look for "Supabase Configuration Status" log
3. Verify `configured: true` and `urlPrefix` shows your actual Supabase URL
4. Check Network tab for failed requests to Supabase


- **Code Splitting**: Routes and components are lazy-loaded
- **Image Optimization**: Proper image loading and compression
- **Bundle Analysis**: Optimized bundle size with tree shaking
- **3D Performance**: Efficient Three.js rendering with proper cleanup
- **Caching**: Proper caching strategies for static assets

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── 3D/             # Three.js components
│   ├── Layout/         # Layout components
│   ├── UI/             # Basic UI components
│   └── admin/          # Admin-specific components
├── pages/              # Page components
│   └── admin/          # Admin pages
├── stores/             # Zustand stores
├── lib/                # Utility functions and API
├── types/              # TypeScript type definitions
└── main.tsx            # Application entry point
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email admin@example.com or create an issue in this repository.

---

**Built with ❤️ by Ir Rugendabanga Clovis**