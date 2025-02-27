# Design Document

## 1. System Architecture Overview

### 1.1 Application Architecture
The Lead Management System will be built using Next.js with TypeScript, following a modern architecture that leverages Next.js 14's features, including the App Router for improved routing capabilities and Server Components for enhanced performance. The architecture will consist of:

- **Client-side components**: Responsible for rendering UI and handling user interactions
- **Server components**: Handling data fetching and processing
- **API routes**: Managing lead data operations and authentication
- **Mock or real database**: Storing lead information and state

### 1.2 Component Structure

```
/app
├── /public           # Public assets
├── /app              # Next.js app directory
│   ├── /api          # API routes
│   │   ├── /leads    # Lead management APIs
│   │   └── /auth     # Authentication APIs
│   ├── /components   # Shared components
│   │   ├── /ui       # UI components (buttons, inputs, etc.)
│   │   └── /forms    # Form components
│   ├── /lib          # Utility functions and helpers
│   ├── /hooks        # Custom React hooks
│   ├── /types        # TypeScript type definitions
│   ├── /public       # Public lead form page
│   └── /dashboard    # Protected internal dashboard pages
```

### 1.3 Data Flow Diagram
1. **Lead Submission Flow**:
   - User fills out public lead form
   - Form validation occurs client-side
   - On submission, data is sent to API endpoint
   - File is uploaded to storage
   - Lead is created with PENDING status
   - Confirmation is displayed to user

2. **Lead Management Flow**:
   - Authenticated user accesses internal dashboard
   - System fetches leads from API
   - User can view lead details and change status
   - Status updates are sent to API
   - UI reflects updated status

## 2. Technology Stack & Rationale

### 2.1 Core Technologies
- **Next.js**: Chosen for its server-side rendering capabilities, API routes, built-in routing, and overall developer experience. Next.js provides an excellent foundation for building both public-facing and internal-facing components of the application.

- **TypeScript**: Implementing TypeScript for type safety will reduce runtime errors, improve code quality through better IDE support, and enhance maintainability. This choice aligns with industry best practices and will make the codebase more robust.

### 2.2 UI/Component Libraries
- **Tailwind CSS**: For styling the application with utility-first CSS. Tailwind offers a highly customizable approach without the overhead of a full component library, allowing for precise matching with the Figma designs.

- **Color System**: Based on the Figma mockups, we'll implement a specific color scheme:
  - Primary brand colors: dark (#1d1d1d) for text and buttons, accent green (#B8D957) for highlighting
  - Status indicators: pending (#6B7280), reached-out (#B8D957)
  - Accent-light (#f8fdd3) used for the sidebar background in the internal admin interface

- **Headless UI**: To complement Tailwind CSS with accessible UI components that can be styled to match the design requirements.

- **JsonForms**: To implement the lead form in a configuration-driven way, making the form structure more maintainable and adaptable.



### 2.3 Form Handling
- **React Hook Form**: For efficient form state management and validation with minimal re-renders. It provides a good balance of performance and developer experience.

- **Zod**: For schema validation, working well with TypeScript and React Hook Form.

### 2.4 State Management
- **Context API** + **useReducer**: For local state management within component trees. This should be sufficient for this application's complexity level.

- **Redux Toolkit** (for bonus implementation): For global state management if the application scales. Redux Toolkit reduces boilerplate and provides built-in immutability, which makes state updates more predictable.

### 2.5 File Upload
- **next-connect**: To handle multipart form data for file uploads.

- **react-dropzone**: For enhanced file upload user experience.

- **multer** (server-side): For processing uploaded files in API routes.

### 2.6 Authentication
- **NextAuth.js**: For implementing a simple authentication system with email/password login. This will secure the internal leads list UI.

- **Middleware**: Using Next.js middleware to protect routes and redirect unauthenticated users.

## 3. Authentication Mechanism Design

### 3.1 Mock Authentication Implementation
For the mock authentication system:

1. **Login Page**: Create a simple login form with email/password fields.
2. **Static Credentials**: Use hardcoded credentials for demonstration (e.g., email: admin@example.com, password: password123).
3. **JWT Tokens**: Generate and store JWT tokens in cookies/local storage upon successful authentication.
4. **Protected Routes**: Implement middleware to check for valid authentication before allowing access to internal pages.

### 3.2 Route Protection Strategy
- **Public Routes**: `/` for the lead submission form, accessible to everyone.
- **Protected Routes**: `/dashboard/*` for internal pages, requiring authentication.
- **Middleware**: Implementing route protection via Next.js middleware that checks for authentication status.
- **Redirection**: Unauthenticated users attempting to access protected routes will be redirected to the login page.

## 4. Component Design

### 4.1 Public Lead Form
- **Form Structure**: Implement a multi-section form matching the Figma design with the distinctive light green background and circular decorative elements.
- **Field Components**: Create reusable form field components with built-in validation, including the "Country of Citizenship" dropdown field shown in the Figma mockup.
- **Visa Selection**: Implement checkbox-based selection for visa categories as displayed in the Figma design (O1, EB-1A, EB-2 NIW, "I don't know" options).
- **File Upload**: Implement a drag-and-drop interface with preview functionality for resume/CV.
- **Submission Handling**: Implement a dedicated success confirmation page with the document icon and "Go Back to Homepage" button as shown in the Figma design.

### 4.2 Internal Leads List UI
- **Table/List View**: Display leads in a table layout with columns aligned with Figma design (Name, Submitted, Status, Country).
- **Detail View**: Implement expandable rows or modal dialogs to show full lead details.
- **Status Management**: Add buttons/controls to change lead status with visual feedback while maintaining the clean UI shown in the design.
- **Search and Filter**: Implement search functionality and dropdown filter for Status that matches the design's minimalist style.
- **Navigation**: Implement the side navigation with the Alma logo as shown in the Figma design.

### 4.3 Status Transition Mechanism
- **Status Button**: Design a clear visual button to change status from PENDING to REACHED_OUT.
- **Confirmation Dialog**: Implement a confirmation step before finalizing status changes.
- **Optimistic Updates**: Update UI immediately while the API request processes in the background.
- **Error Handling**: Provide recovery mechanisms if status updates fail.

## 5. Data Models

### 5.1 Lead Data Structure
```typescript
interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  linkedin: string;
  country: string;
  countryOfCitizenship: string;
  interestedVisas: string[];
  resumeUrl: string;
  openInput: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

enum LeadStatus {
  PENDING = 'PENDING',
  REACHED_OUT = 'REACHED_OUT'
}
```

### 5.2 Form Configuration (for JsonForms implementation)
```typescript
const leadFormSchema = {
  type: 'object',
  properties: {
    firstName: { type: 'string', minLength: 1 },
    lastName: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    linkedin: { type: 'string', format: 'uri' },
    interestedVisas: {
      type: 'array',
      items: { type: 'string' }
    },
    openInput: { type: 'string' }
  },
  required: ['firstName', 'lastName', 'email', 'linkedin', 'interestedVisas']
};
```

## 6. API Design

### 6.1 Lead Creation API
- **Endpoint**: `POST /api/leads`
- **Request**: Multipart form data including file upload
- **Response**: Created lead object with ID
- **Error Handling**: Validation errors, server errors

### 6.2 Leads Retrieval API
- **Endpoint**: `GET /api/leads`
- **Query Parameters**: Optional filters, pagination, sorting
- **Response**: Array of lead objects with pagination metadata
- **Authentication**: Required

### 6.3 Lead Status Update API
- **Endpoint**: `PATCH /api/leads/{id}`
- **Request Body**: New status
- **Response**: Updated lead object
- **Authentication**: Required

### 6.4 File Upload Handling
- **Endpoint**: Part of lead creation
- **Storage**: Files stored in a simulated file system (or real cloud storage in production)
- **Access Control**: Secure links for internal users only

## 7. Performance & User Experience Considerations

### 7.1 Form Validation Feedback
- **Real-time Validation**: Implement client-side validation as users type
- **Error Messages**: Display clear, actionable error messages next to relevant fields
- **Submission Prevention**: Disable submission until all required fields are valid

### 7.2 Responsive Design Approach
- **Mobile-First**: Design components with mobile-first approach
- **Breakpoints**: Implement responsive breakpoints at standard screen sizes
- **Flexible Components**: Ensure UI elements adapt gracefully to different screen widths
- **Touch-Friendly Inputs**: Optimize input sizes and spacing for touch interactions

### 7.3 Loading State Management
- **Loading Indicators**: Implement spinners or skeleton screens during data fetching
- **Optimistic Updates**: Show immediate feedback for user actions before server confirmation
- **Throttling/Debouncing**: Prevent excessive API calls during rapid user interactions

## 8. Testing Strategy

### 8.1 Unit Testing
- **Testing Framework**: Jest for unit testing
- **Component Testing**: React Testing Library for component tests
- **Coverage Targets**: Aim for >80% code coverage on critical paths

### 8.2 Test Planning
- **Form Validation Tests**: Verify all validation rules work correctly
- **API Integration Tests**: Test API endpoints with mocked responses
- **Authentication Tests**: Verify route protection works as expected
- **Responsive Design Tests**: Test UI at different viewport sizes

