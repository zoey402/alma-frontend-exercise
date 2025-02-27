# Alma Lead Management System

A Next.js application for creating, managing, and updating leads for immigration visa prospects.

## Features

- **Public Lead Form**: Allows prospects to submit their information and upload resumes
- **Internal Dashboard**: Protected area for staff to view and manage lead information
- **Lead Status Management**: Simple workflow to track lead status (PENDING → REACHED_OUT)
- **Responsive Design**: Works well on mobile and desktop devices

## Technology Stack

- **Frontend**: Next.js 14 with TypeScript, React Hook Form, Zod
- **Styling**: Tailwind CSS
- **Authentication**: Simple mock authentication system
- **Lead Storage**: Local storage with mock implementation

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/zoey402/alma-frontend-exercise.git
cd alma-frontend-exercise
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Usage

### Public Lead Form

- Access the public lead form at the root URL: [http://localhost:3000/](http://localhost:3000/)
- Fill in all required fields and upload a resume to submit the form

### Internal Dashboard

- Access the internal dashboard at: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- Login credentials for demo:
  - Email: admin@example.com
  - Password: password123
- View lead details by clicking "View Details"
- Update lead status from PENDING to REACHED_OUT using the "Mark as Reached Out" button

## License

MIT