# Design Document

## 1. System Architecture Overview

### 1.1 Application Architecture
The Lead Management System is built using Next.js 14 with TypeScript, following a modern architecture that leverages Next.js App Router for improved routing capabilities and Server Components for enhanced performance. The architecture consists of:

- **Client-side components**: Responsible for rendering UI and handling user interactions
- **Server components**: Handling data fetching and processing
- **API routes**: Managing lead data operations and authentication
- **Mock database**: Storing lead information and state using local JSON storage

### 1.2 Component Structure

```
/app
├── /public           # Public assets and uploads
├── /src              # Source code
│   ├── /app          # Next.js app directory
│   │   ├── /api      # API routes for leads
│   │   ├── /dashboard # Protected internal pages
│   │   ├── /login    # Authentication pages
│   │   └── /page.tsx # Public lead form
│   ├── /components   # Shared components
│   │   ├── /dashboard # Dashboard-specific components
│   │   ├── /lead     # Lead form components
│   │   └── /ui       # Reusable UI components
│   ├── /services     # Service layer for data handling
│   ├── /schemas      # Validation schemas using Zod
│   ├── /types        # TypeScript type definitions
│   ├── /constants    # Application constants
│   └── /mock         # Mock data for development
```

### 1.3 Data Flow Diagram
1. **Lead Submission Flow**:
   - User fills out public lead form
   - Form validation occurs client-side with React Hook Form and Zod
   - On submission, data is sent to API endpoint as FormData
   - File is uploaded to local storage
   - Lead is created with PENDING status
   - Confirmation screen is displayed to user

2. **Lead Management Flow**:
   - Authenticated user accesses internal dashboard
   - System fetches leads from API with optional filtering
   - User can view lead details and change status
   - Status updates are sent to API
   - UI reflects updated status

## 2. Implementation Details & Rationale

### 2.1 Core Technologies
- **Next.js**: Chosen for its server-side rendering capabilities, API routes, built-in routing, and overall developer experience. The App Router in Next.js 14 provides excellent routing capabilities for both public and protected pages.

- **TypeScript**: Implemented for type safety to reduce runtime errors, improve code quality, and enhance maintainability. This has proven valuable in maintaining a robust codebase, especially for form handling and data validation.

### 2.2 UI/Component Implementation
- **Tailwind CSS**: Used for styling with a utility-first approach. Tailwind provided a highly customizable way to match the design requirements, with a custom color system based on the design specifications.

**Note on Design Fidelity**: Due to limitations in font assets and images, the implementation isn't an exact match with the Figma mockups. However, within these constraints, we've made every effort to stay as close as possible to the design intent while maintaining functionality.

- **Component Library**: Custom UI components were created to ensure consistency:
  - Button
  - Input
  - Select
  - Checkbox
  - FileUpload
  - Textarea
  - StatusBadge

### 2.3 Form Handling
- **React Hook Form**: Implemented for efficient form state management and validation with minimal re-renders. The `useForm` hook along with controllers provided excellent handling of complex form inputs.

- **Zod**: Used for schema validation, working well with TypeScript and React Hook Form. Schema definitions provide both runtime validation and TypeScript type inference.

### 2.4 State Management
- **React Hooks**: Used local component state management with `useState` and `useEffect` for most components, which proved sufficient for the application's complexity.

- **App-wide State**: For authentication state, we used cookies and localStorage to maintain login status.

### 2.5 File Upload
- **FormData API**: Used for handling multipart form data for file uploads.
- **Local Storage**: Files are stored in the `/public/uploads` directory for demonstration purposes.

### 2.6 Authentication
- **Mock Authentication System**: Implemented a simple authentication system with hardcoded credentials:
  - Email: admin@example.com
  - Password: password123

- **Next.js Middleware**: Implemented route protection via middleware to check authentication status before allowing access to protected routes.

## 3. Component Design

### 3.1 Public Lead Form
- **Form Structure**: Implemented as multi-section form with clear grouping of related fields.
- **Validation**: Real-time validation with clear error messages.
- **File Upload**: Drag-and-drop and click-to-upload functionality for resumes.
- **Confirmation Screen**: Dedicated page showing submission success.

### 3.2 Internal Leads List UI
- **Table View**: Responsive table displaying key lead information.
- **Detail View**: Expandable rows for viewing complete lead details.
- **Status Management**: Implemented status change functionality with loading indicators.
- **Search and Filter**: Implemented text search and status filtering.

### 3.3 Status Transition Mechanism
- **Current Implementation**: Button-based approach with confirmation through loading state.

> 💡 **Proposed UX Improvement**: 
> 
> Consider replacing the explicit "Mark as Reached Out" button with a clickable status badge. This would be more intuitive as users often expect status indicators to be interactive. This change would:
> 
> 1. Declutter the UI by removing an explicit button
> 2. Follow common UX patterns where status indicators can be toggled
> 3. Provide a more direct way to update status
> 4. Reduce the visual complexity of the leads table
>
> This proposed change would better align with user expectations and modern UI patterns, where the status itself serves as both an indicator and an action point.

## 4. API Design

### 4.1 Implemented Endpoints
- **POST /api/leads**: Create a new lead (public endpoint)
- **GET /api/leads**: Get all leads with filtering and pagination (protected)
- **GET /api/leads/[id]**: Get a specific lead by ID (protected)
- **PATCH /api/leads/[id]/status**: Update a lead's status (protected)

### 4.2 Authentication Mechanism
- **Cookie-based Auth**: Using 'authToken' cookie to maintain authentication
- **Mock JWT**: For demonstration purposes, using a simple token system

### 4.3 Data Storage
- **JSON File Storage**: Using local file system to store leads in a JSON file
- **Mock Service Layer**: Abstracted data access through service classes

## 5. Performance & Responsiveness

### 5.1 Form Validation
- **Client-side Validation**: Implemented real-time validation as users type
- **Schema-based Validation**: Using Zod schemas for consistent validation rules

### 5.2 Responsive Design
- **Mobile-first Approach**: UI elements scale appropriately for different screen sizes
- **Flexible Layout**: Dashboard and form layouts adapt to viewport width

### 5.3 User Experience Enhancements
- **Loading States**: Implemented for form submissions and data fetching
- **Optimistic Updates**: Immediate UI feedback for status changes
- **Error Handling**: Clear error messages for form validations and API failures

## 6. Current Limitations and Future Improvements

### 6.1 Current Limitations
- **Authentication**: Basic mock authentication system without proper security
- **Data Persistence**: Reliance on local file system instead of a proper database
- **Design Fidelity**: Some discrepancies from the Figma mockups due to missing assets

### 6.2 Future Improvements
- **Enhanced Authentication**: Implement NextAuth.js for proper authentication
- **Database Integration**: Replace JSON file storage with a real database
- **Advanced Filtering**: Add more sophisticated search and filtering capabilities
- **Status Workflow**: Implement the proposed clickable status badge design
- **JsonForms Integration**: Implement configuration-driven form generation
- **Testing**: Add comprehensive unit and integration tests
- **UI Refinements**: Further polish to match design mockups more closely