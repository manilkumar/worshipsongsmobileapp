import express from 'express';
import cors from 'cors';
import songsRouter from './songsRouter.js';
import log4js from 'log4js';
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

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/songs", songsRouter);

app.listen(PORT, () => {
    console.log(`Surver running on port ${PORT}`)
});