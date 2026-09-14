Hotel Booking Manager (Angular v22 + n8n AI Agent)
A complete Hotel Booking Management system built with Angular v22, featuring a reactive form, custom pipes/directives, dynamic pricing, and an integrated AI Chatbot using n8n.

📌 Project Note
This project implements the technical requirements of the Mini Project but adapts the domain from a standard Expense Tracker to a Hotel Booking Manager. The core technical architecture (Angular v22, Signals, Reactive Forms, Custom Pipes/Directives, HTTP CRUD, and the n8n AI Chatbot) is implemented exactly as requested. I chose the Hotel domain to demonstrate more complex real-world scenarios, such as dynamic pricing based on nights/guests, date ranges, room categories, and a mock checkout system.

🛠️ Prerequisites
Node.js & npm installed.
Angular CLI v22.
n8n installed locally or running via Docker.
🚀 Installation & Setup
Follow these steps carefully to run the project locally.

1. Clone and Install Dependencies
git clone <your-repository-url>cd hotel-booking-managernpm install
2. Environment Setup (Important!)
For security reasons, the actual environment files containing API keys/Webhook URLs are ignored by Git. You need to create them manually:

Navigate to src/environments/.
Copy environment.development.example.ts and rename it to environment.development.ts.
Open it and ensure the aiAgentWebhookUrl is set to your n8n webhook URL (default: http://localhost:5678/webhook/hotel-chatbot).
3. Start the Local API (json-server)
The application uses json-server as a mock backend. It runs on port 3000.
Open a terminal and run:

bash

npm run api
(Or run json-server --watch db.json --port 3000)

4. n8n AI Agent Setup
This project includes a student-built chatbot that connects to an n8n workflow.

Open your local n8n instance (http://localhost:5678).
Click on "Import from File" and select the My workflow.json file included in the root of this repository.
Open the AI Agent node in the workflow.
You will need to create your own Credential (Groq or OpenAI) and select your model (e.g., gpt-4o-mini or llama-3.3-70b-versatile).
Ensure the Webhook node is active. The webhook URL must match the one in your environment.development.ts file.
5. Start the Angular Application
The app runs on port 4200. Open a new terminal and run:

bash

ng serve
Navigate to http://localhost:4200 in your browser.

✨ Features
Core Angular Features
Standalone Components: No NgModules used.
Signals: State management handled entirely via signal(), computed(), and .set().
Modern Control Flow: Uses @if, @for, and @switch in templates.
Reactive Forms: FormBuilder with Custom Validators (e.g., checkout date must be after check-in).
HTTP Client: Full CRUD operations (GET, POST, PUT, DELETE) communicating with json-server.
Route Guards: Auth guard protecting routes.
UI/UX & Bonus Features
Authentication: Simple login system storing the user in localStorage.
Dark Mode: Toggle between light and dark themes using Bootstrap 5.3.
Dashboard: Displays user analytics (total bookings, total spent, total nights).
Dynamic Pricing: Calculates total price based on room type, number of guests, and number of nights.
Mock Checkout: A payment modal screen before confirming a booking.
Toast Notifications: Visual feedback for actions like deleting a booking.
Custom Pipes & Directives
Custom Pipe (roomTypeIcon): Transforms room types into emojis (e.g., Suite -> 👑 Suite).
Custom Directive (appHighlightPremium): Highlights bookings that exceed a certain price threshold with a gold/orange background.
AI Chatbot Integration
Independent Component: A floating chat widget component.
n8n Webhook: Sends POST requests containing the user's message and booking context to an n8n workflow.
Natural Language Processing: The AI agent answers questions about the user's data (e.g., "What is my total spending?", "Which booking was the largest?").
Multilingual: Detects if the user is typing in Arabic or English and replies in the same language.
