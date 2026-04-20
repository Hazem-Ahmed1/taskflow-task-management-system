# TaskFlow — Task Management System (Angular 17)

TaskFlow is a modern Trello-inspired task management system built with **Angular 17 (standalone components)**. It includes **authentication & authorization (fake accounts)**, a **localStorage-backed fake database**, **boards/lists/cards**, and **drag & drop** workflows with a clean, modern UI.

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

## Screenshots

### Card detail (edit panel)

![Card detail modal](docs/screenshots/card-detail-modal.png)

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

✅ Authentication & authorization (demo accounts with unified user role)  
✅ Fake database seeded from TypeScript + persisted in localStorage  
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
- **Routing**: Angular Router + functional guards (`authGuard`, `noAuthGuard`)
- **Persistence (Fake Backend)**: TypeScript seed data + localStorage (`DatabaseService`)
- **Auth**: Session stored in localStorage (`AuthService`)
- **Styling**: SCSS (design tokens, modern components, animations)

## Demo Accounts

Use any of these accounts on the login page:

- `hazem@taskflow.io` / `hazem123`
- `khaled@taskflow.io` / `khaled123`
- `sara@taskflow.io` / `sara123`
- `ahmed@taskflow.io` / `ahmed123`
- `demo@taskflow.io` / `demo123`

## Notes

- **Fresh seed data**: to reset to the seeded database, clear `taskflow_db` from browser localStorage.
