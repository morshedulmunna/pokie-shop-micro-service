import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import {
  createInventoryService,
  getInventory,
  getInventoryByIdService,
  updateInventoryService,
} from "./controllers";
import errorHandler from "./utils";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Route
app.post("/inventories", createInventoryService);
app.get("/inventories", getInventory);
app.put("/inventories/:id", updateInventoryService);
app.get("/inventories/:id", getInventoryByIdService);
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
