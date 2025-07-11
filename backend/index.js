const express = require('express');
//const bodyParser = require('body-parser');
//const bcrypt = require('bcrypt');
const cors = require('cors');

const songsRouter = require('./songsRouter');

const log4js = require("log4js");


log4js.configure({
    appenders: {
      console: { type: "console" }, 
      file: { type: "file", filename: "logs/app.log" },
      http: { type: "dateFile", filename: "logs/http.log", pattern: ".yyyy-MM-dd", compress: true }
    },
    categories: {
      default: { appenders: ["console", "file"], level: "debug" },
      http: { appenders: ["http"], level: "info" } 
    }
});

const httpLogger = log4js.getLogger("http");

const app = express();
const PORT = process.env.PORT || 5003;

app.use(log4js.connectLogger(httpLogger, { level: "info" }));

app.use((req, res, next) => {
    console.log('Incoming Origin:', req.headers.origin); // Logs the origin header
    next();
});

// Allowed origins
const allowedOrigins = ['https://www.skaarvi.com', 'https://skaarvi.com'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests from the allowed domains
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // No error, allow request
        } else {
            callback(new Error('Not allowed by CORS')); // Block other origins
        }
    },
    // origin: ['http://localhost:3000','http://localhost:8081'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/songs", songsRouter);

app.listen(PORT, () => {
   
    console.log(`Surver running on port ${PORT}`)
})