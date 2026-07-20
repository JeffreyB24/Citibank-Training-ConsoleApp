# Modern Banking Management System

A full-stack banking management system built with **React**, **Spring Boot**, **MongoDB**, and **JWT Authentication**. The application provides separate customer and administrator experiences, allowing secure account management, transaction processing, and administrative banking operations.

---

# Overview

This project simulates a modern online banking platform with role-based authentication.

Customers can securely view their accounts, transfer money, review transaction history, and monitor balances.

Administrators have access to management tools that allow them to create customer accounts, manage banking accounts, process deposits and withdrawals, perform transfers, and monitor customer information.

The user interface was redesigned to provide a modern banking experience while preserving all backend functionality and API integrations.

---

# Features

## Customer Features

- Secure Login
- Customer Dashboard
- View Checking & Savings Accounts
- View Account Balances
- Deposit Funds
- Withdraw Funds
- Transfer Between Accounts
- View Transaction History
- Responsive Dashboard
- Secure Banking Interface

---

## Administrator Features

- Administrator Dashboard
- Customer Management
- Banking Account Management
- Create New Accounts
- Delete Accounts
- Process Deposits
- Process Withdrawals
- Transfer Funds Between Accounts
- View Transaction History
- Banking Statistics
- Secure Administrative Interface

---

# Technology Stack

## Frontend

- React
- React Router
- Axios
- CSS3
- Responsive Design

## Backend

- Spring Boot
- Spring Security
- JWT Authentication
- REST API

## Database

- MongoDB

---

# Project Structure

```
Frontend
│
├── Landing Page
├── Login Page
├── Customer Dashboard
├── My Accounts
├── Customer Transactions
├── Transaction History
├── Admin Dashboard
├── Customer Management
├── Account Management
└── Transaction Management

Backend
│
├── Authentication
├── Customer Services
├── Account Services
├── Transaction Services
├── JWT Security
└── MongoDB Repositories
```

---

# Authentication

The application uses JWT authentication to secure protected endpoints.

After a successful login:

- JWT token is generated
- Token is stored locally
- Protected API endpoints require authentication
- Users are redirected based on role

Roles include:

- Customer
- Administrator

---

# Customer Workflow

1. Login
2. View Dashboard
3. View Account Balances
4. Deposit Money
5. Withdraw Money
6. Transfer Funds
7. Review Transaction History

---

# Administrator Workflow

1. Login
2. Access Admin Dashboard
3. View Customer List
4. Create Customer Accounts
5. Delete Accounts
6. Process Banking Transactions
7. Monitor Banking Activity

---

# UI Redesign

The original project interface was completely redesigned while maintaining all existing backend functionality.

Major improvements include:

- Modern banking inspired interface
- Responsive layouts
- Professional dashboard design
- Banking statistics cards
- Hero sections
- Interactive account cards
- Modern transaction management
- Empty states
- Loading indicators
- Improved spacing and typography
- Consistent color palette
- Mobile responsive layouts
- Improved user experience

---

# Pages Redesigned

### Landing Page

- Modern banking landing page
- Responsive navigation
- Professional hero section
- Feature showcase
- Security information
- Banking preview

---

### Login Page

- Split layout
- Modern authentication interface
- Improved form validation
- Responsive design

---

### Customer Dashboard

- Dynamic account balances
- Banking summary cards
- Quick actions
- Banking benefits
- Security information

---

### My Accounts

- Responsive account cards
- Balance summaries
- Empty states
- Improved account presentation

---

### Customer Transactions

- Deposit funds
- Withdraw funds
- Transfer between accounts
- Transaction history
- Validation
- Loading states

---

### Transaction History

- Modern transaction cards
- Account filtering
- Responsive layout
- Empty states

---

### Administrator Dashboard

- Banking statistics
- Customer overview
- Account overview
- Administrative actions
- Modern dashboard layout

---

### Customer Management

- Search customers
- Create customers
- Delete customers
- Responsive customer cards
- Improved management interface

---

### Account Management

- Create accounts
- Delete accounts
- Account summaries
- Search functionality
- Responsive design

---

### Transaction Management

Administrative transaction processing including:

- Deposits
- Withdrawals
- Transfers
- Transaction history
- Account summaries
- Validation
- Loading indicators

---

# Responsive Design

The application was designed to work across:

- Desktop
- Tablet
- Mobile Devices

Layouts automatically adjust for different screen sizes using CSS media queries.

---

# API

Example endpoints used by the frontend:

```
POST /login

GET /accounts

POST /accounts

DELETE /accounts/{id}

POST /accounts/{id}/deposit

POST /accounts/{id}/withdraw

POST /accounts/transfer

GET /accounts/{id}/transactions

GET /customers
```

---

# Error Handling

The application includes:

- Client-side validation
- API error handling
- Success notifications
- Loading states
- Empty state messaging
- Invalid input prevention

---

# Security

- JWT Authentication
- Protected API endpoints
- Role-based authorization
- Secure administrator pages
- Authenticated customer pages

---

# Future Improvements

Potential future enhancements include:

- Online account applications
- Bill payments
- External bank transfers
- Mobile banking notifications
- Loan management
- Credit card management
- Profile editing
- Two-factor authentication
- Email verification
- Password reset
- Banking analytics
- Admin reporting dashboard

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/banking-system.git
```

## Frontend

```bash
cd frontend

npm install

npm run dev
```

## Backend

```bash
cd backend

./mvnw spring-boot:run
```

---

# Screens Included

- Landing Page
- Login
- Customer Dashboard
- My Accounts
- Customer Transactions
- Transaction History
- Admin Dashboard
- Customer Management
- Account Management
- Transaction Management

---

# Author

Developed by Jeffrey Berdeal

Florida International University

Bachelor of Science in Computer Science

---

# License

This project was developed for educational purposes and demonstrates a modern full-stack banking application using React, Spring Boot, MongoDB, and JWT Authentication.
