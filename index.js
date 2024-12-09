const express = require("express");
const path = require("path");
const indexRoutes = require("./routes/indexRoutes");

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});