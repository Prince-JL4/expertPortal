const mongoose = require("mongoose");
mongoose.set("bufferCommands", false); // Disable buffering before requiring models
require("pg"); // Explicitly require to force Vercel bundler to include it
require("dotenv").config();
const { app, connectDB, syncDB } = require("../server/app");

// Start server if not running as a Vercel serverless function
if (process.env.NODE_ENV === "development" || process.env.AZURE_WEBAPP || !process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    (async () => {
        try {
            await connectDB();
            await syncDB();
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        } catch (error) {
            console.error("Failed to start server:", error);
            process.exit(1);
        }
    })();
} else {
    // For Vercel: Ensure DB is connected (lazy connection)
    connectDB().catch(err => console.error("Vercel DB connection error:", err));
}

// Export the app for Vercel
module.exports = app;
