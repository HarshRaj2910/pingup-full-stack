<h1 align="center">🚀 PingUp - Full-Stack Social Media Platform</h1>

<p align="center">
  A modern, feature-rich social media web application designed to connect friends, share moments, and build communities. Built with the MERN stack (MongoDB, Express, React, Node.js) and powered by modern tools like Clerk for authentication and ImageKit for media optimization.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</p>

## ✨ Key Features

- **Secure Authentication:** Seamless user signup, login, and session management using Clerk.
- **Dynamic Feeds:** Real-time post creation, sharing, liking, and commenting.
- **Media Uploads:** Optimized image and file sharing using ImageKit and Multer.
- **Interactive UI:** A highly responsive, modern interface with Dark/Light mode support.
- **Real-time Engagement:** Notification sounds, toast alerts, and a dynamic chat interface.
- **Code Sharing:** Dedicated features for students/developers to share and discuss code snippets.

---

## 🛠️ Technology Stack & Architecture

To ensure scalability, performance, and a smooth developer experience, PingUp uses a carefully selected modern tech stack:

### Frontend (Client)
- **React 18 & Vite:** React provides a robust component-based architecture, while Vite offers lightning-fast Hot Module Replacement (HMR) and optimized build times.
- **Redux Toolkit:** Used for predictable, centralized state management. Essential for handling complex social media states like user feeds, cached profiles, and chat synchronization without prop-drilling.
- **Tailwind CSS:** A utility-first CSS framework that allows rapid UI development, consistent theming (Dark/Light modes), and highly responsive designs directly within components.
- **React Router DOM:** Enables seamless, client-side routing for a fast Single Page Application (SPA) experience.
- **Clerk React:** Chosen for its drop-in, highly secure authentication components, reducing the overhead of managing complex auth flows (OAuth, 2FA, etc.) manually.
- **Axios:** For clean, promise-based HTTP requests to our backend API.

### Backend (Server)
- **Node.js & Express.js:** A lightweight, non-blocking backend architecture perfect for I/O heavy operations (like handling simultaneous user requests, posts, and messaging).
- **MongoDB & Mongoose:** A NoSQL database that provides the flexibility needed for a social platform. Documents are ideal for storing varied data structures like nested comments, dynamic user profiles, and posts.
- **Clerk Express:** Middleware to securely verify JWT tokens and handle authentication webhooks from Clerk.
- **ImageKit:** A global CDN and image/video optimization service. Chosen to reduce server load and ensure fast media delivery to users, which is critical for a social media app.
- **Inngest:** Used for robust background job processing. Instead of blocking the main thread, tasks like heavy media processing, analytics, or scheduled events are handled reliably in the background.
- **Multer:** Middleware for handling `multipart/form-data`, primarily used for uploading files from the client to the server before sending them to ImageKit.
- **Nodemailer:** For sending transactional emails (welcome emails, password resets, platform alerts).

---

## 🔮 Future Scope & Roadmap

PingUp is constantly evolving. Here is a glimpse into the upcoming features that will transform how users interact:

- **📹 Real-Time Video Calling:** Integration of **WebRTC** to allow users to make high-quality, peer-to-peer 1-on-1 and group video calls directly from their browser, just like FaceTime or WhatsApp.
- **🤝 PingUp 'Meets':** Virtual rooms for users to host watch parties, study sessions, or community town halls with screen sharing and collaborative tools.
- **⚡ WebSockets Integration:** Upgrading from polling to **Socket.io** for instant, real-time chat messages, typing indicators, and live notifications without page refreshes.
- **📱 Progressive Web App (PWA):** Making PingUp installable on mobile devices with offline support and push notifications, providing a native app-like experience.
- **🤖 AI-Powered Content Moderation:** Implementing AI models to automatically detect and filter inappropriate content, ensuring a safe community environment.

---

## ⚙️ Local Development Setup

Follow these steps to run PingUp locally on your machine.

### Prerequisites
- Node.js (v18+)
- MongoDB connection URI
- Accounts with Clerk and ImageKit for API keys

### 1. Clone the repository
```bash
git clone https://github.com/your-username/pingup-full-stack.git
cd pingup-full-stack
```

### 2. Setup the Backend
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add your credentials:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000
```
Start the frontend development server:
```bash
npm run dev
```

### 4. You're all set! 🚀
Open `http://localhost:5173` in your browser to see PingUp in action.

---

## 👨‍💻 Contributing
Contributions are always welcome! Feel free to open a PR or an issue if you have ideas for improvements or find any bugs.

## 📜 License
This project is licensed under the MIT License.
