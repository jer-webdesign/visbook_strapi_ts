# Visbook - Responsive Online Visual Graphics Bookstore Documentation

## 1. Brief Description
Visbook is a modern, responsive online bookstore developed with **React 19 and TypeScript** to showcase and sell visual graphics books. The application is designed to deliver a seamless user experience for browsing, searching, and purchasing books related to visual arts, design, and graphics. The platform integrates with STRAPI Cloud for content management and Firebase for authentication and order management, following best practices for modern web development with full type safety.

## 2. Features
- Provides user authentication (Sign Up/Sign In with email/password or Google) using Firebase.
- Allows users to browse, search, and view detailed information for each book.
- Enables both signed-in and guest users to add books to a cart and proceed to checkout.
- Maintains order history and account management features for signed-in users.
- Implements a responsive navigation menu and layout for all devices.
- Supports admin management of book data via STRAPI Cloud.
- Simulates a secure payment workflow for demonstration purposes (no real payment processing).
- **Full TypeScript support** with comprehensive type safety and developer tooling.

## 3. Technologies Used
- React 19 (Vite)
- **TypeScript 5.x**
- React Router
- STRAPI Cloud (Headless CMS, PostgreSQL)
- Firebase Authentication (Email/Password & Google)
- Firestore Database
- SendGrid (Email Service)
- Custom modular CSS
- Render (deployment)

## 4. Vite Configuration Notes
- The Vite config (`vite.config.ts`) is set up for deployment on Render:
  - Uses environment variables for API URLs.
  - Sets `build.chunkSizeWarningLimit` to 1000 kB to reduce chunk size warnings.
  - The `start` script runs: `vite preview --port $PORT --host` for production compatibility.
  - The `preview.allowedHosts` option includes your Render domain (e.g., `visbook.onrender.com`) to allow external access in production.
  - TypeScript compilation is integrated into the build process for type checking.

## 5. Project & Code Structure
```
visbook_strapi_ts/
├── public/
│   ├── assets/
│   │   └── images/
│   │       ├── vblogo.png
│   │       ├── visbook-about.jpg
│   │       ├── visbook-banner.jpg
│   │       └── icons/
│   │           ├── book-icon.png
│   │           ├── cart-icon.png
│   │           ├── contact-icon.png
│   │           ├── home-icon.png
│   │           ├── signin-icon.png
│   │           ├── signup-icon.png
│   │           ├── about-icon.png
│   │           └── info-icon.png
│   └── visbook.png
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── firebase.ts
│   ├── main.tsx
│   ├── types.ts              # TypeScript type definitions
│   ├── vite-env.d.ts         # Vite environment variable types
│   ├── components/
│   │   ├── Navbar/
│   │   │   ├── Navbar.tsx    # Contains all cart counter logic with TypeScript
│   │   │   └── Navbar.css
│   │   ├── Footer/
│   │   │   ├── Footer.tsx
│   │   │   └── Footer.css
│   │   ├── Modal/
│   │   │   ├── Modal.tsx
│   │   │   └── Modal.css
│   ├── context/
│   │   └── AuthContext.tsx   # Fully typed authentication context
│   └── pages/
│       ├── Home/
│       │   ├── Home.tsx
│       │   └── Home.css
│       ├── Books/
│       │   ├── Books.tsx
│       │   ├── Books.css
│       │   ├── BookDetail.tsx
│       │   ├── BookDetail.css
│       │   ├── NewBooks.tsx
│       │   └── NewBooks.css
│       ├── About/
│       │   ├── About.tsx
│       │   └── About.css
│       ├── Contact/
│       │   ├── Contact.tsx
│       │   └── Contact.css
│       ├── Cart/
│       │   ├── Cart.tsx       # Cart logic with TypeScript types
│       │   └── Cart.css
│       ├── Account/
│       │   ├── AccountSettings.tsx
│       │   └── AccountSettings.css
│       ├── Dashboard/
│       │   ├── YourAccount.tsx
│       │   └── YourAccount.css
│       ├── OrderHistory/
│       │   ├── OrderHistory.tsx
│       │   └── OrderHistory.css
│       ├── Payment/
│       │   ├── Payment.tsx
│       │   ├── Payment.css
│       │   ├── PaymentCompleted.tsx
│       │   └── PaymentCompleted.css
│       ├── SignIn/
│       │   ├── SignIn.tsx
│       │   └── SignIn.css
│       ├── SignUp/
│       │   ├── SignUp.tsx
│       │   └── SignUp.css
├── .env
├── package.json
├── tsconfig.json             # TypeScript configuration
├── tsconfig.node.json        # TypeScript config for Node tools
├── vite.config.ts            # Vite config in TypeScript
├── eslint.config.mjs         # ESLint configuration
└── README.md
```

**Recent TypeScript Conversion:**
- Entire codebase migrated from JavaScript to TypeScript for enhanced type safety
- All `.jsx` files converted to `.tsx` with proper type annotations
- Centralized type definitions in `src/types.ts` for `Book`, `CartItem`, `Order`, `UserProfile`, and `Address`
- Environment variables properly typed in `vite-env.d.ts`
- Full type coverage in authentication context and all components
- ESLint configuration updated to support TypeScript files

## 6. Key Files and Folders

**src/**  
  Main source code for the frontend application (TypeScript).
  - **types.ts**  
    Centralized TypeScript type definitions for the entire application, including:
    - `Book`: Book data structure with all fields
    - `CartItem`: Shopping cart item with quantity
    - `Order`: Order history structure
    - `UserProfile`: User profile information
    - `Address`: Shipping/billing address structure
  - **vite-env.d.ts**  
    TypeScript definitions for Vite environment variables (API keys, URLs, etc.)
  - **components/**  
    Contains reusable UI components (all TypeScript).  
    - **Navbar/**  
      - `Navbar.tsx`: The navigation bar React component with full type safety.  
      - `Navbar.css`: Styles for the navigation bar.
    - **Footer/**
      - `Footer.tsx`: Footer component.
      - `Footer.css`: Styles for Footer.
    - **Modal/**
      - `Modal.tsx`: Modal dialog component with typed props.
      - `Modal.css`: Styles for Modal.
  - **pages/**  
    Contains page-level React components (all TypeScript).
    - **About/**
      - `About.tsx`: About page component.
      - `About.css`: Styles for About page.
    - **Account/**
      - `AccountSettings.tsx`: Account settings page with typed form handling.
      - `AccountSettings.css`: Styles for account settings.
    - **Books/**  
      - `Books.tsx`: Books listing page with typed book data.  
      - `Books.css`: Styles for Books listing.  
      - `BookDetail.tsx`: Book detail page with type-safe routing.
      - `BookDetail.css`: Styles for Book detail page.
      - `NewBooks.tsx`: New books page with carousel functionality.  
      - `NewBooks.css`: Styles for new books page.
    - **Cart/**
      - `Cart.tsx`: Shopping cart page with typed cart operations.
      - `Cart.css`: Styles for Cart page.
    - **Dashboard/**
      - `YourAccount.tsx`: User dashboard main page.
      - `YourAccount.css`: Styles for user dashboard.
    - **OrderHistory/**  
      - `OrderHistory.tsx`: User's order history page with typed order data.  
      - `OrderHistory.css`: Styles for order history page.
    - **Payment/**
      - `Payment.tsx`: Payment page.
      - `Payment.css`: Styles for payment page.
      - `PaymentCompleted.tsx`: Payment completion confirmation.
      - `PaymentCompleted.css`: Styles for payment completion.
    - **SignIn/**
      - `SignIn.tsx`: Sign-in page with typed authentication.
      - `SignIn.css`: Styles for sign-in.
    - **SignUp/**
      - `SignUp.tsx`: Sign-up page with typed form validation.
      - `SignUp.css`: Styles for sign-up.
  - **assets/**  
    Images, icons, and other static files.
  - **context/**  
    React context providers with full TypeScript support.
    - `AuthContext.tsx`: Authentication context with typed user profile, Firebase User, and auth methods.
  - **App.tsx**  
    Main application component, sets up routing and layout (TypeScript).
  - **main.tsx**  
    Entry point for the React application (TypeScript).
  - **firebase.ts**  
    Firebase configuration and initialization (TypeScript).

**public/**  
  Static files served directly (e.g., index.html, favicon).

**.env**  
  Environment variables (API keys, secrets).  
  **Note:** This file is ignored by git for security.

**.gitignore**  
  Specifies files and folders to be ignored by git (e.g., node_modules, .env).

**package.json**  
  Lists project dependencies, scripts, and metadata. Includes TypeScript and type definition packages.

**tsconfig.json**  
  TypeScript compiler configuration for the project. Configured for React 19 with strict type checking.

**tsconfig.node.json**  
  TypeScript configuration for build tools and Node.js scripts (Vite config, etc.).

**vite.config.ts**  
  Vite build tool configuration in TypeScript.

**eslint.config.mjs**  
  ESLint configuration supporting both JavaScript and TypeScript files.

**README.md**  
  Project overview and setup instructions.

---

## 7. Notable Configuration

- **.gitignore**  
  Ensures sensitive files like .env and unnecessary files like node_modules are not tracked by git.

- **Environment Variables**  
  Place API keys and secrets in .env (never commit this file).

---

## 8. How to Run

1. **Install dependencies:**  
   ```sh
   npm install
   ```
2. **Start the development server:**  
   ```sh
   npm run dev
   ```
3. **Type checking (without build):**  
   ```sh
   npm run typecheck
   ```
4. **Build for production:**  
   ```sh
   npm run build
   ```
   This runs TypeScript type checking followed by Vite production build.
5. **Preview production build:**  
   ```sh
   npm run preview
   ```

**TypeScript Features:**
- IntelliSense and autocomplete in supported editors (VS Code recommended)
- Compile-time type checking catches errors before runtime
- Better refactoring support with type-safe renames
- Self-documenting code with explicit type annotations

---

## 9. Contribution

- Make changes in the src directory.
- Use feature branches and submit pull requests.
- Ensure .env and other sensitive files are not committed.

---

## 10. Software Component Roles
- **Navbar, Footer, Modal:** These are reusable UI components for navigation, layout, and dialogs (TypeScript).
- **Pages:** Each folder in `src/pages` corresponds to a route/view (e.g., Home, Books, Cart) with full type safety.
- **firebase.ts:** Handles Firebase and Firestore configuration (TypeScript).
- **context/AuthContext.tsx:** Manages user authentication state using React Context with comprehensive TypeScript types for user profiles and auth methods.
- **types.ts:** Centralized type definitions shared across the application.
- **STRAPI Cloud:** Provides book data management (CRUD) and media asset hosting.

## 11. TypeScript Architecture

### 11.1. Type System
The application uses a comprehensive type system defined in `src/types.ts`:

```typescript
// Core data types
interface Book {
  id: number | string;
  title: string;
  author: string;
  price: number;
  price_cad?: number;
  description?: string;
  // ... additional fields
}

interface CartItem extends Book {
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  createdAt: Date | Timestamp;
  // ... additional fields
}

interface UserProfile {
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  homeAddress?: string;
}
```

### 11.2. Environment Variables
All environment variables are typed in `src/vite-env.d.ts`:
```typescript
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_STRAPI_URL: string
  readonly VITE_STRAPI_MEDIA_URL: string
  readonly VITE_FIREBASE_API_KEY: string
  // ... additional variables
}
```

### 11.3. Component Props
All React components use TypeScript interfaces for props:
```typescript
interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}
```

### 11.4. Firebase Integration
Firebase types are imported from the official Firebase SDK and integrated with custom types for seamless type safety across authentication and database operations.

## 12. Logical Architecture (Visual)
```
[User] ⇄ [React 19 + TypeScript Frontend] ⇄ [STRAPI Cloud API] ⇄ [PostgreSQL]
                   ⇅ [Firebase Auth]
                   ⇅ [Firestore DB]
                   
Type Safety Flow:
[TypeScript Compiler] → [Type Checking] → [Build (Vite)] → [Production Bundle]
```

## 13. Installation and Dependencies
- Clone the repository from source control.
- Run `npm install` in the project root to install all dependencies, including:
  - TypeScript and type definitions (@types/react, @types/react-dom, @types/node)
  - React 19 and React Router
  - Firebase SDK
  - Vite build tool
  - ESLint for code quality
- Refer to `package.json` for a complete list of required packages.
- TypeScript compiler and type checking tools are automatically configured.

## 13. STRAPI Cloud Setup & Book Data Management

### 13.1. STRAPI Cloud Project Setup
To set up the STRAPI Cloud backend, the developer should:
- Sign up or log in at https://cloud.strapi.io/.
- Create a new project and select the appropriate plan (free or paid).
- Use PostgreSQL as the database (provided by STRAPI Cloud).
- Deploy backend code from the `backend-postgresql-strapi` GitHub repository to cloud.strapi.io/projects.
- Wait for provisioning and note the unique STRAPI Cloud URL (e.g., `https://your-project-name.cloud.strapi.io`).

### 13.2. Configure Book Collection Type
- In the STRAPI admin panel, navigate to "Content-Type Builder" and create a new collection type named `Book`.
- Add fields such as Title, Subtitle, Cover Image, Price, Published Date, Description, Author, and any additional fields required (e.g., ISBN, category, tags).
- Save and apply changes; STRAPI will update the database schema automatically.

### 13.3. Add Book Data
- In the Content Manager, add book entries manually or use the provided `visbookData.js` script (from the backend codebase) to bulk import data from `visbook.csv`.
- Upload book cover images to the STRAPI Media Library.
- For each book, ensure the filename in the Content Manager matches the Media Library filename, and update the book entry with the correct image URL.
- Save each entry. Repeat as needed for all books.

### 13.4. Set API Permissions
- In "Settings" > "Roles" > "Public", enable `find` and `findOne` permissions for the `Book` collection to allow frontend access.
- Save the updated permissions.

### 13.5. Fetch Book Data from React Frontend
- The frontend fetches book data from the Strapi REST API with full TypeScript type safety, enabling real-time updates and centralized content management. Example code for fetching all book entries in a React component:
  ```typescript
  import { Book } from '../types';
  
  useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch(`${STRAPI_URL}/api/books?pagination[page]=1&pagination[pageSize]=30`);
      const data = await res.json();
      setBooks(data.data as Book[]);
    };
    fetchBooks();
  }, []);
  ```
- Each book entry is typed according to the `Book` interface defined in `src/types.ts`. TypeScript ensures all book properties are correctly accessed and provides autocomplete for book fields.
- This approach ensures the frontend always displays the latest book data managed in Strapi Cloud, with compile-time type checking to catch errors early.

### 13.6. STRAPI Cloud Media Management
- All uploaded images are managed and served by STRAPI Cloud. The API response for each book includes a URL to the cover image, which can be used directly in React components.

### 13.7. Updating and Managing Book Data
- The STRAPI admin panel allows editing, deleting, or adding new books at any time. Changes are reflected immediately in the API and on the website.

### 13.8. Security and Best Practices
- For production deployments, restrict write permissions to authenticated users only.
- Store the STRAPI API base URL in environment variables within the React app for security.

## 14. Firebase Setup/Installation & Authentication

### 14.1. Firebase Project Setup
To set up Firebase, the developer should:
- Go to the [Firebase Console](https://console.firebase.google.com/).
- Create a new project (Google Analytics is optional).
- Register the app (web icon) and obtain the Firebase config object.
- Paste the config object into `src/firebase.js` in the React project.

### 14.2. Enable Authentication Providers
- In the Firebase Console, navigate to "Build" > "Authentication" > "Get started".
- Enable "Email/Password" and optionally "Google" providers under the "Sign-in method" tab.
- Configure additional settings as needed (e.g., email verification, password reset).
- **Important:** Add your deployed domain (e.g., `visbook.onrender.com`) to the **Authorized domains** list in the Firebase Authentication settings. This is required for Google sign-in to work in production. Go to **Authentication > Settings > Authorized domains > Add domain** and enter your Render domain.

### 14.3. Install Firebase SDK
- In the project root, run:
  ```sh
  npm install firebase
  ```
- Import and initialize Firebase in `src/firebase.ts` (TypeScript):
  ```typescript
  import { initializeApp } from 'firebase/app';
  import { getAuth } from 'firebase/auth';
  
  const firebaseConfig = { /* your config here */ };
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  ```

### 14.4. Authentication Usage in Code
- Use Firebase Auth methods with TypeScript for sign-up, sign-in, and sign-out in React components. Example for email/password sign-in:
  ```typescript
  import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
  import { auth } from '../firebase';
  
  const handleSignIn = async (email: string, password: string) => {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Save user info to context or state
    } catch (error) {
      // Handle errors with proper typing
      console.error(error);
    }
  };
  ```
- For Google sign-in:
  ```typescript
  import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
  
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  // Google user info in result.user
  ```

### 14.5. User Profile Management
- Firebase Auth manages user accounts and securely stores user profile information (email, display name, etc.). The current user can be accessed anywhere in the app using TypeScript:
  ```typescript
  import { onAuthStateChanged, User } from 'firebase/auth';
  import { auth } from '../firebase';
  
  onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      // User is signed in - TypeScript knows user properties
      console.log(user.email, user.displayName);
    } else {
      // User is signed out
    }
  });
  ```
- Store user info in React context (e.g., `AuthContext.tsx`) with proper TypeScript interfaces for global access and type safety.

### 14.6. Security and Best Practices
- Sensitive Firebase config or API keys should never be exposed in public repositories.
- Use Firebase Authentication rules to restrict access to user data as needed.
- Always handle authentication errors gracefully in the UI.

## 15. Firestore Database Setup & Order History
- Enable Firestore Database in the Firebase console.
- Use Firestore in TypeScript code to save and retrieve order history with proper types. Example:
  ```typescript
  import { getFirestore, collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
  import { Order } from './types';
  
  const db = getFirestore();
  
  // Save order
  const orderData: Omit<Order, 'id'> = {
    items: cartItems,
    total: totalAmount,
    createdAt: Timestamp.now(),
    // ... other fields
  };
  await addDoc(collection(db, 'orders'), orderData);
  
  // Retrieve orders
  const querySnapshot = await getDocs(collection(db, 'orders'));
  const orders: Order[] = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Order));
  ```

## 16. Usage of the Website

- Users can browse the homepage to see featured and new release books, or navigate to the Books page to view the full catalog.
- Each book entry displays a cover image, title, author, price, and a link to a detailed view.
- The Book Detail page provides comprehensive information, including description, publisher, published year, ratings, and purchase options.
- Both guests and signed-in users can add books to their cart and proceed to checkout. The Cart page summarizes selected items and total price.
- Signed-in users (via email/password or Google) have their order history saved and can manage their account settings from the Account page.
- The payment process is a simulation only and does not connect to any real bank account or payment gateway. It is intended for educational and demonstration purposes only.
- The site is fully navigable via the responsive Navbar and Footer, with clear links to About, Contact, and other informational pages.

### 16.1 Contact Form & Automated Email Replies
- When a user submits a message through the Contact page, the system automatically sends an email reply to the user's provided email address.
- This is handled by a Firebase Cloud Function, which is triggered by a new entry in the `contactMessages` Firestore collection.
- The function uses SendGrid (with a secure API key) to send a professional auto-reply, confirming receipt of the user's message and providing further instructions.
- The auto-reply email also advises users to check their Spam or Junk folder and mark the message as 'Not Spam' to ensure future delivery.
- All sensitive email credentials are managed securely using Firebase environment config and are not stored in the codebase.

#### 16.1.1 How the Automated Email Reply Works
1. When a user submits the Contact form, their message is saved to the `contactMessages` collection in Firestore.
2. A Firebase Cloud Function (deployed in the `/functions` directory) listens for new documents in this collection and sends an auto-reply email to the user.
3. The email is sent using SendGrid, which is configured with a secure API key and sender address (never hardcoded in the codebase).
4. The auto-reply email confirms receipt and provides further instructions, and reminds users to check their Spam/Junk folder.

#### 16.1.2 Setup & Installation (for maintainers)
1. Install nodemailer and @sendgrid/mail in the Cloud Functions directory:
   ```sh
   cd functions
   npm install nodemailer @sendgrid/mail
   ```
2. Create a SendGrid account:
   - Sign up at https://sendgrid.com/.
   - Verify your email and set up a Sender Identity (domain or single sender).
   - Generate an API key with "Full Access" or at least "Mail Send" permissions.
3. Configure Firebase environment variables for SendGrid:
   - In the Cloud Functions directory, set environment config (replace with your actual values):
     ```sh
     firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY" sendgrid.sender="your_verified_sender@example.com"
     ```
   - Deploy the config:
     ```sh
     firebase deploy --only functions
     ```
4. API Setup:
   - The Cloud Function uses the SendGrid API to send emails. No additional API setup is needed beyond the API key and sender verification.
   - All API calls are made server-side from the Cloud Function, keeping credentials secure.

**Note:**
- The frontend never has access to email credentials or API keys.
- If the SendGrid sender or API key changes, update the Firebase config and redeploy the function.

## 17. API Integration
- The frontend communicates with the Strapi Cloud REST API to fetch book data, including all fields and cover image URLs.
- User authentication and profile management are handled via the Firebase Authentication API.
- Order history and user-specific data are stored and retrieved using the Firestore API.
- All API calls are made securely from the frontend, with sensitive keys and endpoints managed via environment variables.
- The integration ensures real-time updates: new books or changes in Strapi, or new orders in Firestore, are reflected immediately on the site without redeployment.

## 18. Accessibility Considerations & Responsive Design
The Visbook platform is built to be accessible and responsive for all users, regardless of device or ability. The development team implemented a mobile-first, responsive CSS strategy to ensure seamless usability on phones, tablets, and desktops. Navigation menus are fully keyboard accessible, with clear focus states and strong color contrast to support users with varying needs. All buttons and forms are touch-friendly, and images are optimized with descriptive alt text. The site is tested across major browsers and screen sizes to deliver a consistent and reliable experience for everyone.

## 19. Design Inspiration
- 3DTotal Store (https://store.3dtotal.com/)
- Indigo (https://www.indigo.ca/en-ca/)

## 20. Deployment Notes
- The frontend React application is deployed on Render (https://render.com/) using the free tier.
- The build process is automated: on push to the main branch, Render builds and deploys the latest code.
- Environment variables for STRAPI API URL and Firebase config are set in the Render dashboard, not hardcoded in the codebase.
- The STRAPI backend is hosted on Strapi Cloud, and the database is managed by the built-in PostgreSQL instance.
- Media assets (book covers) are served from the STRAPI Cloud Media Library.
- For best performance, static assets are cached and the site uses HTTPS by default.
- The development team regularly monitors Render and Strapi Cloud dashboards for build status, errors, and usage limits.

## 21. Attributions
- React. (n.d.). useRef – React documentation. https://react.dev/reference/react/useRef
- React. (n.d.). useState – React documentation. https://react.dev/reference/react/useState
- React. (n.d.). useEffect – React documentation. https://react.dev/reference/react/useEffect
- React. (n.d.). useContext – React documentation. https://react.dev/reference/react/useContext
- React. (n.d.). useNavigate – React Router documentation. https://reactrouter.com/en/main/hooks/use-navigate
- React. (n.d.). useParams – React Router documentation. https://reactrouter.com/en/main/hooks/use-params
- React. (n.d.). useLocation – React Router documentation. https://reactrouter.com/en/main/hooks/use-location
- React. (n.d.). Router – React Router documentation. https://reactrouter.com/en/main/routers/router
- React. (n.d.). Routes – React Router documentation. https://reactrouter.com/en/main/routers/routes
- React. (n.d.). Route – React Router documentation. https://reactrouter.com/en/main/routers/route
- Strapi. (n.d.). Strapi [Computer software]. https://strapi.io/
- Firebase. (n.d.). Firebase [Computer software]. Google. https://firebase.google.com/
- Firestore. (n.d.). Cloud Firestore [Computer software]. Google. https://firebase.google.com/products/firestore
- Render. (n.d.). Render [Cloud platform]. https://render.com/
- SendGrid. (n.d.). SendGrid [Email delivery service]. https://sendgrid.com/
- 3DTotal Store. (n.d.). 3DTotal Store. https://store.3dtotal.com/
- Indigo. (n.d.). Indigo. https://www.indigo.ca/en-ca/
- Canva. (n.d.). Canva. https://www.canva.com/
- Google. (n.d.). Google sign-in logo [SVG image]. https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg



