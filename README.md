# HotelBookingManager

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.8. It is a Hotel Booking Management system featuring a reactive form, custom pipes/directives, dynamic pricing, and an integrated AI Chatbot using n8n.

## Prerequisites

Before running the app, ensure you have the following installed and running:

* Node.js & npm
* Angular CLI v22
* [n8n](https://n8n.io/) running locally (for the AI Chatbot workflow)

## Environment Setup (Important!)

For security reasons, the actual environment files containing API keys/Webhook URLs are ignored by Git. You need to create them manually:

1. Navigate to `src/environments/`.
2. Copy `environment.development.example.ts` and rename it to `environment.development.ts`.
3. Open it and ensure the `aiAgentWebhookUrl` is set to your n8n webhook URL (default: `http://localhost:5678/webhook/hotel-chatbot`).

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Backend Setup (json-server)

This project uses `json-server` as a mock backend. It runs on port 3000. Open a separate terminal and run:

```bash
npm run api
```

(Or run `json-server --watch db.json --port 3000`)

## n8n AI Agent Setup

This project includes a student-built chatbot that connects to an n8n workflow.

1. Open your local n8n instance (`http://localhost:5678`).
2. Click on "Import from File" and select the `My workflow.json` file included in the root of this repository.
3. Open the AI Agent node in the workflow.
4. You will need to create your own Credential (Groq or OpenAI) and select your model.
5. Ensure the Webhook node is active. The webhook URL must match the one in your `environment.development.ts` file.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
