# KapsonTools - Product Management System

## Overview
KapsonTools is a comprehensive product management system built with React and CoreUI. It provides a robust interface for managing products, categories, subcategories, HSN numbers, and orders. The system is designed to handle product inventory, pricing, and order management efficiently.

## Features

### Product Management
- View all products in a tabular format
- Add new products with detailed specifications
- Edit existing product information
- Delete products with confirmation
- View detailed product information
- Product image management with multiple images support
- Product categorization and subcategorization

### Category Management
- Create and manage product categories
- Add category images
- Edit category information
- Delete categories with confirmation

### Subcategory Management
- Create subcategories linked to main categories
- Manage subcategory details
- Edit and delete subcategories

### HSN Number Management
- Add and manage HSN numbers
- Set GST percentages for products
- Edit and delete HSN numbers

### Order Management
- View all orders
- Detailed order information
- Order status tracking
- Order product details

## Technical Stack

### Frontend
- React.js
- CoreUI for UI components
- Material-UI icons
- React Router for navigation
- Axios for API requests

### API Integration
- RESTful API endpoints
- Token-based authentication
- Secure data transmission

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env` file in the root directory and add:
```
REACT_APP_API_URL=your_api_url
```

4. Start the development server
```bash
npm start
# or
yarn start
```

## Project Structure

```
src/
├── components/          # Reusable components
├── views/              # Page components
│   ├── base/          # Base views
│   ├── pages/         # Page components
│   └── dashboard/     # Dashboard components
├── Services/          # API services
├── assets/           # Static assets
└── _nav.js          # Navigation configuration
```

## API Endpoints

### Products
- GET `/products` - Get all products
- GET `/products/:id` - Get product by ID
- POST `/products` - Create new product
- PUT `/products/:id` - Update product
- DELETE `/products/:id` - Delete product

### Categories
- GET `/categories` - Get all categories
- POST `/categories` - Create new category
- PUT `/categories/:id` - Update category
- DELETE `/categories/:id` - Delete category

### Subcategories
- GET `/subcategories` - Get all subcategories
- POST `/subcategories` - Create new subcategory
- PUT `/subcategories/:id` - Update subcategory
- DELETE `/subcategories/:id` - Delete subcategory

### HSN Numbers
- GET `/hsnNumbers` - Get all HSN numbers
- POST `/hsnNumbers` - Create new HSN number
- PUT `/hsnNumbers/:id` - Update HSN number
- DELETE `/hsnNumbers/:id` - Delete HSN number

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details

## Contact
Your Name - your.email@example.com
Project Link: [https://github.com/yourusername/KapsonTools](https://github.com/yourusername/KapsonTools)
