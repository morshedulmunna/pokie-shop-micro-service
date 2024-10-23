import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
dotenv.config();

const app = express();

//security middleware
app.use(helmet());

//rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
  statusCode: 429,
  headers: true,
  handler: (_req, res) => {
    res.setHeader("Retry-After", Math.ceil(15 * 60));
    return res;
  },
});
app.use("/api", limiter);

//request logger
app.use(morgan("dev"));
app.use(express.json());

//TODO: Auth Middleware

//health route
app.get("/health", (_req, res) => {
  res.status(200).send({ message: "API-gateway is healthy" });
});

//error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send({
      message: `Internal server error: ${err.message}`,
    });
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API-gateway is running on port ${PORT}`);
});
