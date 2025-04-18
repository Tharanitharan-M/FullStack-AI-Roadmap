# FullStackAI Roadmap

This Next.js application helps users become job-ready Full Stack Developers with AI/LLM expertise by providing a personalized learning roadmap. It tracks progress, shows what to study, explains why each topic matters, and motivates consistent learning through daily streaks.

## Features

- **Roadmap Dashboard:** Displays a dashboard with learning pillars (e.g., Frontend, Backend, AI) and progress bars for each.
- **Pillar Expansion:** Allows users to expand each pillar to view a checklist of subtopics with progress tracking.
- **Subtopic Generation:** Uses an AI tool (Genkit) to generate relevant subtopics for each learning pillar based on current industry trends and best practices.
- **Explanation Generation:** Generates short explanations for each subtopic, answering the question "Why am I learning this?" using an AI model (Genkit).
- **Progress Tracking:** Automatically updates subtopic, pillar, and overall roadmap completion as users check off items.
- **Daily Streaks & Motivation:** Displays a daily streak counter and overall progress percentage to encourage consistent learning.
- **Authentication:** Sign-in and sign-out functionality to persist user data.

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following:
    ```
    GOOGLE_GENAI_API_KEY=<Your_API_KEY>
    ```
    
    Obtain the google api from [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
    
4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

5.  **Run Genkit in development mode (in a separate terminal):**

    ```bash
    npm run genkit:dev
    # or
    yarn genkit:dev
    # or
    pnpm run genkit:dev
    ```

## Deployment

1.  **Build the application:**

    ```bash
    npm run build
    # or
    yarn build
    # or
    pnpm build
    ```

2.  **Deploy to Vercel:**

    -   Sign up for a [Vercel](https://vercel.com/) account.
    -   Install the Vercel CLI: `npm install -g vercel`
    -   Run `vercel` in your project directory and follow the prompts.

## Technologies Used

-   [Next.js](https://nextjs.org/)
-   [React](https://reactjs.org/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [Shadcn/ui](https://ui.shadcn.com/)
-   [Lucide React](https://lucide.dev/)
-   [Genkit](https://genkit.dev/)

## AI Features

This application uses Genkit to:

1.  **Generate Subtopics:** AI suggests subtopics within each Learning Pillar.
2.  **Generate Explanations:** AI provides short explanations for each subtopic, answering "Why am I learning this?"
3. **Google Oauth**

## Contributing

Contributions are welcome! Please submit a pull request with your changes.

## License

MIT
