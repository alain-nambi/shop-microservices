import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

// 1. Create the client instance
const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

// 2. Define an async function to establish the connection
async function connectAndInitDB() {
    try {
        await client.connect(); // Wait for the connection to succeed
        console.log("Database client connected successfully.");
    } catch (error) {
        console.error("Database connection failed:", error);
        // Handle failure (e.g., exit the process)
        throw error; 
    }
}

// 3. Call the setup function immediately
connectAndInitDB(); 

// 4. Export the Drizzle instance
export const db = drizzle(client);

// Note: You must ensure any code that uses 'db' only runs after 'connectAndInitDB' has completed.
// In a server environment (like Express or Next.js), this setup often occurs when the application starts.