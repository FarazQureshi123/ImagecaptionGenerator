const express = require('express');
const indexRoutes = require('../routes/auth.routes');
const cookieparser = require("cookie-parser");
const postRoutes = require("../routes/post.routes")


const app = express();

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(express.json());
app.use('/api/auth',indexRoutes)
app.use(cookieparser());
app.use('/api/posts',postRoutes);



module.exports = app;