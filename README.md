# Demystify - AI Legal Document Analysis

Demystify is an AI-powered suite of tools designed to simplify the complexities of legal and official documents. It allows users to analyze, translate, draft, and get guidance on documents with confidence and clarity.

## Features

-   **Document Demystifier**: Upload a document (TXT, PDF, JPG) to get a simple summary, an acceptance score, a timeline of key dates, a list of red flags, and actionable next steps.
-   **Document Translator**: Instantly translate documents into various languages with a real-time streaming preview.
-   **Contract Drafter**: Generate preliminary legal documents like Freelance Agreements, Rental Leases, and Bills of Sale by filling out a simple form.
-   **Document Guide**: A conversational, ChatGPT-like interface to get step-by-step guidance on official procedures (e.g., "How do I get a passport?").
-   **Analysis History**: Automatically saves your analysis results to your browser's local storage for future reference.
-   **Modern UI**: A sleek, modern interface with a professional dark theme, fluid animations, and a responsive design.

---

## Local Development Setup

Follow these steps to get the Demystify application running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 18.x or later recommended)
-   npm or yarn
-   A code editor (e.g., [Visual Studio Code](https://code.visualstudio.com/))
-   A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Step 1: Clone the Repository

First, clone the project repository to your local machine using Git.

```bash
git clone <your-repository-url>
cd <repository-folder-name>
```

### Step 2: Install Dependencies

Install the necessary project dependencies using npm or yarn.

```bash
npm install
```

### Step 3: Configure Environment Variables

The application requires a Google Gemini API key to function.

1.  Create a new file named `.env` in the root directory of the project.
2.  Open the `.env` file and add your API key in the following format:

    ```
    API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```

    Replace `YOUR_GEMINI_API_KEY_HERE` with your actual key. This file is ignored by Git, so your key will remain private.

### Step 4: Run the Development Server

Start the local development server. This project is set up to run with a simple development server.

```bash
npm run dev
```

*(Note: If a `dev` script is not defined in `package.json`, you may need to use a tool like `vite` or a simple static server to serve the `index.html` file.)*

### Step 5: Open the Application

Once the server is running, you can access the application in your web browser, typically at:

[http://localhost:3000](http://localhost:3000)

---

## Deployment to Vercel

Deploying Demystify to Vercel is a straightforward process.

### Prerequisites

-   A [Vercel](https://vercel.com/) account.
-   Your project pushed to a Git provider (e.g., GitHub, GitLab, Bitbucket).

### Step 1: Import Your Project

1.  Log in to your Vercel dashboard.
2.  Click the **"Add New..."** button and select **"Project"**.
3.  Import the Git repository that contains your project.

### Step 2: Configure the Project

Vercel is excellent at auto-detecting frameworks. For this vanilla React + TypeScript setup, the default settings should work well.

-   **Framework Preset**: Vercel should detect `Vite` or you can select `Create React App`. If it's a custom setup, ensure the following settings are correct.
-   **Build Command**: `npm run build` (or your project's specific build script).
-   **Output Directory**: `dist` (or the folder your build script outputs to).
-   **Install Command**: `npm install`.

### Step 3: Add Environment Variables

This is the most important step to ensure the deployed application can access the Gemini API.

1.  In your project's dashboard on Vercel, go to the **"Settings"** tab.
2.  Click on **"Environment Variables"** in the left sidebar.
3.  Add a new variable with the following details:
    -   **Key**: `API_KEY`
    -   **Value**: Paste your Google Gemini API key here.
4.  Ensure the variable is available for all environments (Production, Preview, and Development).
5.  Click **"Save"**.

### Step 4: Deploy

Navigate back to your project's "Deployments" tab and trigger a new deployment (or re-deploy the latest one if you added the environment variable after the initial import).

Vercel will build your project and deploy it. Once finished, you will be provided with a live URL where you can access your fully functional Demystify application.
