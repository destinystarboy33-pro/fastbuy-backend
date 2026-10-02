import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";
import paymentRoute from "./routes/paymentRoute.js"
import cors from "cors";
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./swagger-output.json" with {type: "json"}
import { paymentWebhook } from "./controllers/paymentController.js";
dotenv.config();

const app = express();



const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  }),
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", authRoute);
app.use("/product", productRoute);
app.use("/pay", paymentRoute)
app.use("")

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("My Database is connected");
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
