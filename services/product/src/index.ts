import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
dotenv.config();

import errorHandler from "./utils";
import { CreateProduct, GetProduct, GetProductDetails } from "./controllers";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Route

app.post("/create-product", CreateProduct);
app.get("/get-products", GetProduct);
app.get("/get-product-details/:id", GetProductDetails);

// Use the error-handling middleware
app.use(errorHandler);
// 404 handler
app.use((_req: express.Request, res: express.Response) => {
  res.status(404).send({
    message: "Not found",
  });
});

// Error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    res.status(500).send(`Internal server error: ${err.message}`);
  }
);

const PORT = process.env.PORT || 3000;
const serviceName = process.env.SERVICE_NAME || "inventory";

app.listen(PORT, () => {
  console.log(`${serviceName} is listening on port ${PORT}`);
});
