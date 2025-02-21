# Task Management App

## Overview
This **Task Management App** is a interactive application built using **React, Next.js, Typescript, Zustand, IndexedDB**. It enables users to manage tasks with advanced features like **sorting, filtering, pagination, and custom fields**.

## Features
### Core Features
- **Task CRUD Operations**: Create, edit, delete, and update tasks seamlessly.
- **Sorting & Filtering**: Users can sort and filter tasks based on title, priority, status, and custom fields.
- **Pagination**: Efficiently handle large task lists with customizable page sizes.
- **Custom Fields**: Add/remove custom fields (text, number, checkbox) to tasks.
- **State Management**: Zustand for a clean and scalable architecture.

### Technologies Used
- **React & Next.js**: Frontend framework for building UI components.
- **Zustand**: Lightweight state management for optimal performance.
- **IndexedDB**: Used as the persistent storage solution for tasks.
- **Lodash**: Utility library for sorting and filtering.
- **TypeScript**: Ensures type safety and robust development.
- **React Hook Form & Zod**: Validations and form management.
- **Tailwind CSS**: For styling and responsiveness.

## Assumptions & Design Decisions
- **Persistent Storage**: IndexedDB is used for storing tasks instead of a backend database.
- **Sorting Mechanism**: Sorting works seamlessly for predefined and custom fields (e.g., text, number, checkbox).
- **Custom Fields**: Users can add/remove custom fields dynamically without breaking existing features.
- **Real-Time Updates**: State is managed using Zustand to ensure instant UI updates.

## Interesting Technical Challenges
### 1️. **Using IndexedDB for Task Persistence**
Instead of relying on an API or local storage, **IndexedDB** is used for task storage. This enables structured data storage and fast retrieval without backend dependencies.

### 2️.  **Dynamic Sorting & Filtering for Custom Fields**
Sorting and filtering logic adapts to newly added custom fields, ensuring **text fields** sort alphabetically, **number fields** sort numerically, and **checkbox fields** filter correctly.

### 3️. **Optimized State Management with Zustand**
**Zustand** for a more efficient, minimal, and direct state management approach.

### 4️. **Animations for UI Enhancements**
Implemented smooth **animations** to enhance the user experience, making interactions more intuitive and visually appealing.

## Installation & Running Locally
To run the project locally, follow these steps:

```sh
# Clone the repository
git clone https://github.com/your-username/task-management-app.git
cd task-management-app

# Install dependencies
yarn install  # or npm install

# Start the development server
yarn dev  # or npm run dev
```

## Preview
🔗 **Live Demo**: [Task Management App](https://task-management-app-nine-tau.vercel.app/)

## Future Enhancements
- **Drag & Drop Support**: Enable users to reorder tasks visually.
- **Task Dependencies**: Introduce parent-child relationships between tasks.
- **Backend Integration**: Connect with an API for multi-user collaboration.
- **Bonus Milestones**: Implementing all the interesting bonus milestones.

---
This project is a feature-rich task management tool, implementing core functionalities efficiently while keeping scalability in mind.
