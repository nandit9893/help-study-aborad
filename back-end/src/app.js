import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import authRouter from "./routes/auth.routes.js";
import websiteRouter from "./routes/website.routes.js";
import taskRouter from "./routes/task.routes.js";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("Blocked by CORS:", origin);
      }
    },
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("✅ Server is running correctly!");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("/public"));
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api/user", authRouter);
app.use("/api/website", websiteRouter);
app.use("/api/task", taskRouter);

export default app;