# GitHub Copilot Instructions

This document provides comprehensive guidance for AI coding agents working on the Estoque Inteligente frontend web application.

## Project Overview

This is a modern Next.js application for asset and inventory management, built with TypeScript, React, and SCSS. The application follows a service-oriented architecture with custom UI components and maintains strict separation of concerns.

## Architecture & Patterns

### Tech Stack
- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: SCSS modules with CSS variables
- **HTTP Client**: Axios with custom API instance
- **State Management**: React Context (UserContext) + local component state
- **Fonts**: Onest (Google Fonts)

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
├── context/               # React Context providers
├── services/              # API abstraction layer
└── styles/               # Global and page-specific styles
```

### Key Architectural Decisions
- **Service Layer**: All API calls go through `src/services/` for abstraction
- **Component Composition**: Components support composition patterns (e.g., ButtonGroup)
- **SCSS Variables**: Use CSS custom properties for themeable design tokens
- **Token Management**: JWT tokens handled in service layer with localStorage

## Code Conventions

### File Naming
- Components: PascalCase directory with PascalCase files (`Button/Button.tsx`)
- Services: snake_case with `_service.ts` suffix
- Styles: kebab-case for CSS classes, match component names for SCSS files
- Types: Co-located with components or in dedicated `types/` subdirectories

### TypeScript Guidelines
- Always use strict TypeScript
- Define interfaces for all props and API responses
- Use `forwardRef` for components that need DOM refs
- Prefer explicit typing over `any`

### Component Patterns
```tsx
// Standard component structure
"use client"; // When needed for client-side features

import React, { forwardRef } from 'react';
import { ComponentProps } from './types/Component.types';
import './component.scss';

const Component = forwardRef<HTMLElement, ComponentProps>(({
  // Destructure props with defaults
  prop = 'default',
  ...props
}, ref) => {
  // Component logic
  
  return (
    <element ref={ref} className="component" {...props}>
      {/* JSX */}
    </element>
  );
});

Component.displayName = 'Component';
export default Component;
```

### SCSS Conventions
- Use BEM-like naming: `.component`, `.component__element`, `.component--modifier`
- Define CSS variables in separate `*-variables.scss` files
- Use SCSS maps for variants (palettes, sizes, etc.)
- Always scope styles to component classes

```scss
// Component variables
:root {
  --component-primary: #value;
  --component-size-sm: 12px;
}

// Component styles
.component {
  // Base styles
  
  &__element {
    // Element styles
  }
  
  &--modifier {
    // Modifier styles
  }
}
```

## Service Layer Guidelines

### API Configuration
- Base API instance in `src/services/api.ts`
- Environment variable: `NEXT_PUBLIC_STUFF_API`
- All services import from the base API instance

### Service Structure
```typescript
// service_name.ts
import api from './api';

export interface ServiceResponse {
  // Define response types
}

export const serviceName = {
  async method(params: ParamType): Promise<ServiceResponse> {
    const token = localStorage.getItem('token');
    const response = await api.method('/endpoint', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      // Additional config
    });
    return response.data;
  }
};
```

### Token Management
- Store JWT in localStorage with key `'token'`
- Include in Authorization header: `Bearer ${token}`
- Handle token presence/absence gracefully
- Clear token on logout or auth errors

## Component Guidelines

### Button Component
The `Button` component is the reference implementation for composable components:

- **Variants**: `primary`, `secondary`, `outline`
- **Palettes**: `default`, `success`, `danger`
- **Sizes**: `sm`, `md`, `lg`
- **Features**: Icons, loading states, full width, disabled states
- **Composition**: Supports `ButtonGroup` wrapper

### Form Components
- Use controlled components with React Hook Form (when applicable)
- Validate on blur and submit
- Show loading states during API calls
- Handle error states gracefully

### Modal Patterns
- Use React portals for modals
- Implement proper focus management
- Support keyboard navigation (ESC to close)
- Backdrop click to close (with confirmation for forms)

### List Components
- Implement search and filter functionality
- Support pagination for large datasets
- Show loading skeletons during data fetching
- Handle empty states with clear messaging

## State Management

### User Context
- Global user state via `UserContext`
- Persisted in localStorage
- Provides `user` object and `setUser` function
- Used for authentication status and user info

### Local State Patterns
- Use `useState` for component-specific state
- Use `useEffect` for side effects and API calls
- Implement loading and error states consistently
- Debounce search inputs (300ms recommended)

## API Integration

### Request Patterns
```typescript
// Standard API call with error handling
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await apiService.getData();
    // Handle success
  } catch (err) {
    setError('Failed to fetch data');
    console.error(err);
  } finally {
    setLoading(false);
  }
};
```

### Error Handling
- Show user-friendly error messages
- Log detailed errors to console
- Implement retry mechanisms for transient failures
- Handle network errors gracefully

## Styling Guidelines

### Layout Patterns
- Use CSS Grid for 2D layouts
- Use Flexbox for 1D layouts
- Implement responsive design with CSS breakpoints
- Use CSS custom properties for consistent spacing

### Color System
- Define color palettes in SCSS variables
- Use semantic color names (`primary`, `success`, `danger`)
- Implement dark/light mode support via CSS variables
- Ensure WCAG AA contrast compliance

### Typography
- Use Onest font family consistently
- Define type scales in CSS variables
- Implement responsive typography
- Ensure good line height and spacing

## Development Workflow

### Environment Setup
```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

### Environment Variables
- `NEXT_PUBLIC_STUFF_API`: API base URL
- `ADMIN_PASSWORD`: Admin access (if applicable)
- Store sensitive values in `.env.local` (gitignored)

### Testing Approach
- Write unit tests for utility functions
- Integration tests for API services
- Component testing with React Testing Library
- E2E tests for critical user flows

## Common Patterns & Solutions

### Handling Authentication
```typescript
// Check authentication status
const { user } = useUser();
const isAuthenticated = !!user;

// Redirect if not authenticated
useEffect(() => {
  if (!isAuthenticated) {
    router.push('/login');
  }
}, [isAuthenticated]);
```

### Dynamic Routing
```typescript
// Organization detail page: /organization/[id]
export default function OrganizationPage({ 
  params: { id } 
}: { 
  params: { id: string } 
}) {
  // Use the id parameter
}
```

### Data Fetching Patterns
```typescript
// Fetch data on component mount
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await apiService.getData(id);
      setData(data);
    } catch (error) {
      setError('Failed to load data');
    }
  };
  
  if (id) fetchData();
}, [id]);
```

### Modal State Management
```typescript
// Modal state pattern
const [isOpen, setIsOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState<Item | null>(null);

const openModal = (item?: Item) => {
  setSelectedItem(item || null);
  setIsOpen(true);
};

const closeModal = () => {
  setIsOpen(false);
  setSelectedItem(null);
};
```

## Best Practices

### Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimize images with Next.js Image component
- Lazy load non-critical components

### Accessibility
- Use semantic HTML elements
- Implement proper ARIA labels
- Ensure keyboard navigation
- Test with screen readers

### Security
- Sanitize user inputs
- Validate data on both client and server
- Use HTTPS for all API calls
- Store sensitive data securely

### Code Quality
- Follow ESLint and Prettier configurations
- Write descriptive commit messages
- Use meaningful variable and function names
- Comment complex business logic

## Troubleshooting

### Common Issues
1. **SCSS Variables Not Found**: Ensure proper import order and variable definitions
2. **API Calls Failing**: Check token presence and API endpoint configuration
3. **TypeScript Errors**: Verify prop types and component interfaces
4. **Styling Not Applied**: Check CSS module imports and class name usage

### Debugging Tips
- Use React Developer Tools for component debugging
- Check Network tab for API call issues
- Use console.log strategically (remove before commit)
- Verify environment variables are loaded correctly

## Integration Points

### External Services
- API endpoints defined in service layer
- Authentication via JWT tokens
- File uploads (if applicable) handled through dedicated endpoints

### Third-party Libraries
- Axios for HTTP requests
- Next.js for routing and SSR
- SCSS for styling
- TypeScript for type safety

This document should be updated as the project evolves and new patterns are established.
