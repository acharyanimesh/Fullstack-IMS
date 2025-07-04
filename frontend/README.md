# Inventory Management System - Frontend

A modern React-based frontend for the Inventory Management System with comprehensive features for managing products, categories, suppliers, and transactions.

## 🚀 Features

### ✅ Completed Features

#### Authentication & Authorization
- User registration and login
- JWT token-based authentication with encryption
- Role-based access control (Admin, Manager, User)
- Protected routes with automatic redirects

#### Dashboard
- Overview cards showing key metrics
- Inventory alerts for low stock items
- Top products display
- Real-time data updates

#### Product Management
- Complete CRUD operations for products
- Product listing with search and filtering
- Product details view
- Category and supplier associations
- Stock quantity management
- Image URL support
- Expiry date tracking

#### Category Management (Admin Only)
- Create, read, update, delete categories
- Category-based product filtering
- Product count per category
- Admin-only access control

#### Supplier Management
- Complete supplier CRUD operations
- Contact information management
- Supplier-based product associations
- Product count per supplier

#### Transaction Management
- Purchase transactions (add inventory)
- Sale transactions (reduce inventory)
- Transaction history with filtering
- Transaction status tracking
- Real-time inventory updates

#### User Profile & Settings
- User profile management
- Personal information updates
- Account settings
- Session information display
- Logout functionality

#### Enhanced UI Components
- Reusable component library
- Advanced table with sorting capabilities
- Enhanced pagination component
- Search and filter components
- Toast notification system
- Modal dialogs
- Loading states
- Alert messages with auto-dismiss

## 🛠 Tech Stack

- **React 19** - Latest React version with modern features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Crypto-js** - Token encryption for security

## 🔧 Setup & Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   - Backend API should be running on `http://localhost:5050`
   - No additional environment variables needed

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 🎯 Usage

### Default Admin Account
- Email: `admin@inventory.com`
- Password: `admin123`
- Role: ADMIN

### Navigation
- **Dashboard**: Overview and key metrics
- **Products**: Manage product inventory
- **Categories**: Manage product categories (Admin only)
- **Suppliers**: Manage supplier information
- **Transactions**: View transaction history
- **Purchase**: Add inventory through purchases
- **Sell**: Process sales and reduce inventory
- **Profile**: Manage user account
- **Settings**: Application preferences

## 🔐 Security Features

- JWT token encryption using AES
- Secure token storage in localStorage
- Role-based route protection
- API request authentication headers
- Input validation and sanitization

## 🎨 UI/UX Features

- Modern, clean design with Tailwind CSS
- Consistent color scheme and typography
- Responsive layout for all screen sizes
- Loading states and error handling
- Intuitive navigation and user flows
- Accessibility considerations

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen orientations
