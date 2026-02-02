# TaskFlow - Task Management System

A production-ready task management application built with Angular 17, featuring drag & drop, user collaboration, and real-time notifications.

![Angular](https://img.shields.io/badge/Angular-17-red?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=flat-square&logo=typescript)

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation & Run

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Open browser at `http://localhost:4200`

### Build for Production

```bash
npm run build
```

## How to Use

### Managing Boards
1. **Create Board**: Click "Create New Board" button on home page
2. **Edit Board**: Click pencil icon on board card
3. **Star Board**: Click star icon to mark as favorite
4. **Open Board**: Click on any board card to view details

### Working with Lists
1. **Add List**: Click "Add List" button on board page
2. **Edit List**: Click list title to edit inline
3. **Reorder Lists**: Drag and drop lists horizontally
4. **Delete List**: Click trash icon on list

### Managing Cards
1. **Create Card**: Click "Add Card" in any list
2. **Edit Card**: Click on card to open details modal
3. **Move Cards**: Drag cards between lists or within same list
4. **Set Priority**: Choose Low, Medium, High, or Urgent in card details
5. **Set Deadline**: Click date picker in card details
6. **Assign Users**: Search and add users to cards
7. **Add Comments**: Type in comment box in card details

### Notifications
- Click bell icon (top right) to view notifications
- Badge shows unread count
- Click notification to mark as read
- "Clear All" to dismiss all notifications

### User Features
- Search users by name
- View user avatars
- Add/remove board members
- Assign multiple users to cards

## Key Features

✅ Drag & drop lists and cards  
✅ Board management with custom colors  
✅ Card priorities and deadlines  
✅ User collaboration  
✅ Real-time notifications  
✅ Comments and descriptions  
✅ Responsive design  

## Tech Stack

- **Framework**: Angular 17 (Standalone Components)
- **Language**: TypeScript 5.2
- **Drag & Drop**: Angular CDK
- **State Management**: RxJS BehaviorSubjects
- **Styling**: SCSS
