# Snapify - Event Photo Sharing Platform

Snapify is a modern web application that allows users to create and manage photo-sharing events. It provides a seamless experience for event organizers to collect photos from participants through a simple and intuitive interface.

## Features

- **Event Management**
  - Create and customize photo-sharing events
  - Set photo limits per event and per user
  - Configure expiration dates
  - Customize allowed photo filters

- **Photo Upload**
  - Real-time photo capture
  - Multiple filter options
  - Responsive design for mobile and desktop
  - Secure cloud storage

- **User Management**
  - Authentication system
  - Role-based access control
  - User-specific photo limits
  - Admin dashboard

- **Gallery**
  - Real-time photo gallery
  - Filter and search capabilities
  - Responsive grid layout
  - Photo preview and download options

## Tech Stack

- **Frontend**
  - Next.js 14
  - React
  - Tailwind CSS
  - NextAuth.js

- **Backend**
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL
  - Cloudinary

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/snapify.git
   cd snapify
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory with the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/snapify"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"

   # Cloudinary
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"

   # Email (Optional)
   EMAIL_SERVER_HOST="smtp.example.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email"
   EMAIL_SERVER_PASSWORD="your-password"
   EMAIL_FROM="noreply@example.com"
   ```

4. **Database Setup**
   ```bash
   npx prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
snapify/
├── prisma/              # Database schema and migrations
├── public/             # Static files
├── src/
│   ├── app/           # Next.js app directory
│   ├── components/    # React components
│   ├── lib/          # Utility functions and services
│   └── styles/       # Global styles
├── .env              # Environment variables
└── package.json      # Project dependencies
```

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/events/*` - Event management endpoints
- `/api/photos/*` - Photo upload and management endpoints
- `/api/upload` - Direct upload to Cloudinary

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@snapify.com or open an issue in the GitHub repository.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudinary](https://cloudinary.com/)
