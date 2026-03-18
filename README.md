# 🔄 Community Reuse and Exchange Hub

A modern full-stack web application that enables community members to exchange and reuse items, promoting sustainability and reducing waste.

## 🌐 Live Demo

Check out the live application here: [ExchangeHub Frontend](https://exchangehub-frontend.onrender.com)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **User Authentication**: Secure login and registration system
- **User Roles**: Support for regular users, admins, and parents
- **Item Exchange**: Browse, post, and exchange items within your community
- **User Dashboard**: Personalized dashboard for managing your items and exchanges
- **Admin Panel**: Manage users, items, and platform content
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **CORS Support**: Secure cross-origin requests for frontend-backend communication

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library with latest features
- **Vite** - Next-generation frontend build tool
- **React Router v7** - Client-side routing
- **Axios** - HTTP client for API requests
- **ESLint** - Code quality and consistency

### Backend
- **Django 6.0** - Python web framework
- **Django REST Framework** - RESTful API development
- **Django CORS Headers** - Cross-Origin Resource Sharing support
- **SQLite** - Database (included, can be replaced with PostgreSQL/MySQL)
- **Gunicorn** - WSGI application server
- **WhiteNoise** - Static file serving

## 📁 Project Structure

```
Community Reuse and Exchange Hub/
├── 1.ExchangeHub-Frontend/          # React frontend
│   ├── src/
│   │   ├── Components/              # React components
│   │   │   ├── Admin.jsx            # Admin dashboard
│   │   │   ├── Home.jsx             # Home page
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Register.jsx         # Registration page
│   │   │   ├── User.jsx             # User dashboard
│   │   │   ├── Parent.jsx           # Parent dashboard
│   │   │   └── Header.jsx           # Navigation header
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # Entry point
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   └── index.html                   # HTML template
│
├── 2.ExchangeHub-Backend/           # Django backend
│   ├── Exchange_django/             # Django settings
│   │   ├── settings.py              # Project settings
│   │   ├── urls.py                  # URL routing
│   │   ├── wsgi.py                  # WSGI configuration
│   │   └── asgi.py                  # ASGI configuration
│   ├── Hubapp/                      # Main Django app
│   │   ├── models.py                # Database models
│   │   ├── views.py                 # API views
│   │   ├── urls.py                  # App URL routing
│   │   ├── admin.py                 # Admin interface
│   │   └── migrations/              # Database migrations
│   ├── manage.py                    # Django management script
│   ├── requirements.txt             # Python dependencies
│   └── db.sqlite3                   # SQLite database
│
└── README.md                        # This file
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org)
- **Python** (v3.8 or higher) - [Download here](https://python.org)
- **npm** or **yarn** - Comes with Node.js
- **pip** - Comes with Python
- **Git** - [Download here](https://git-scm.com)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd "7.Community Reuse and exchange hub"
```

### 2. Frontend Setup

```bash
cd "1.ExchangeHub-Frontend"

# Install dependencies
npm install

# Verify installation
npm run lint
```

### 3. Backend Setup

```bash
cd "../2..ExchangeHub-Backend"

# Create virtual environment
python -m venv myenv

# Activate virtual environment
# On Windows:
myenv\Scripts\activate
# On macOS/Linux:
source myenv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Create a superuser (admin account)
python manage.py createsuperuser
```

## 🎯 Running the Application

### Start the Backend (Django)

```bash
# From 2..ExchangeHub-Backend directory
# Make sure your virtual environment is activated

python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### Start the Frontend (React)

In a new terminal:

```bash
# From 1.ExchangeHub-Frontend directory

npm run dev
```

The frontend will be available at `http://localhost:5173` (or another port if 5173 is busy)

## 📚 API Documentation

The backend provides RESTful API endpoints for:

- **Authentication**: Login, registration, logout
- **Users**: User profiles and management
- **Items**: Create, read, update, delete items
- **Exchanges**: Request and manage exchanges
- **Admin**: Administrative operations

Access the Django Admin panel at:
```
http://localhost:8000/admin/
```

Log in with the superuser credentials you created during setup.

## 🔌 Environment Configuration

### Backend Configuration

Edit `2..ExchangeHub-Backend/Exchange_django/settings.py` to configure:
- Database settings
- Allowed hosts
- CORS origins
- Debug mode (set to `False` in production)
- Secret key

### Frontend Configuration

Update API endpoints in your components if needed. The default is:
```
http://localhost:8000/api/
```

## 📝 Available Scripts

### Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend

```bash
python manage.py runserver              # Start development server
python manage.py makemigrations         # Create new migrations
python manage.py migrate                # Apply migrations
python manage.py createsuperuser        # Create admin user
python manage.py collectstatic          # Collect static files
```

## 🐛 Troubleshooting

### Frontend Issues

- **Port 5173 already in use**: Change port in `vite.config.js` or kill the process using the port
- **Module not found errors**: Delete `node_modules` and run `npm install` again
- **CORS errors**: Ensure backend is running and CORS is properly configured

### Backend Issues

- **Unable to migrate**: Ensure you're in the correct directory and virtual environment is activated
- **ModuleNotFoundError**: Install missing packages with `pip install -r requirements.txt`
- **Port 8000 already in use**: Use `python manage.py runserver 8000` with a different port

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source. See LICENSE file for details (if available).

## 💡 Future Improvements

- Advanced search and filtering
- Item categories and tags
- User ratings and reviews
- Notification system
- Social features (messaging, following)
- Mobile app (React Native)
- Payment integration for premium features

## 📞 Support

For questions or issues, please:

1. Check existing issues in the repository
2. Create a new GitHub issue with detailed description
3. Contact the development team

---

**Happy Exchanging! 🎉**
