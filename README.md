# Overview

A full-stack e-commerce application being built with React, Node, Express, and PostgreSQL.

Features:
- Browse product listings
- View individual product details
- Add products to personal cart
- Securely checkout

## Roadmap

- **Backend - Minimum Viable Product**
    - ✅ User routes (signup, login, hashed passwords, JWT auth)
    - ✅ Product routes (CRUD)
    - ✅ Cart routes (CRUD, checkout)

- **Frontend - Minimum Viable Product**
    - ✅ Product listing page (fetch products from db)
	- ✅ User signup
	- ✅ User login
    - ✅ Cart page
	- ⬜ Checkout page
	- ⬜ MVP polish

- **Additional Features & Product Readiness**
    - ⬜ Deployment
    - ⬜ Redis caching for product listing
    - ⬜ Dockerize the app
    - ⬜ Add unit testing (Jest)
    - ⬜ Various improvements and optimizations

## API Documentation

### Auth Routes `/auth`

- **POST** `/signup`
    - Register a new user
        ```json
        {
            "name": "Adam",
            "email": "adam@example.com",
            "password": "Password123"
        }
        ```

- **POST** `/login`
    - Login and receive JWT token
        ```json
        {
            "email": "adam@example.com",
            "password": "Password123"
        }
        ```

- **GET** `/profile`
    - Get current user's profile (protected)

### Product Routes `/products`

- **GET** `/` 
    - List all products (public)

- **GET** `/:id`
    - Get product details by ID (public)

- **POST** `/`
    - Add a new product (admin only)
        ```json
        {
            "name": "Apple",
            "description": "Fresh fruit.",
            "price": 1.00,
            "stock": 10
        }
        ```

- **PUT** `/:id`
    - Update product details (admin only)
        ```json
        {
            "name": "Green Apple",
            "description": "Fresh, tasty fruit.",
            "price": 1.25,
            "stock": 15
        }
        ```

- **DELETE** `/:id`
    - Delete a product (admin only)

### Cart Routes `/cart`

- **GET** `/`
    - Get all cart items for current user (protected)

- **POST** `/add`
    - Add item to cart, or increase quantity (protected)
        ```json
        {
            "product_id": 1,
            "quantity": 1
        }
        ```

- **PUT** `/update/:productId`
    - Set quantity of specified cart item (protected)
        ```json
        {
            "quantity": 3
        }
        ```

- **DELETE** `/remove/:productId`
    - Remove one product from the cart (protected)

- **DELETE** `/clear`
    - Clear all items from the current user's cart (protected)

- **POST** `/checkout`
    - Finalize cart into a new order and clear cart (protected)

## API Folder Structure

```
api/src/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
└── index.ts
```