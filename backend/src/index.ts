import dotenv from "dotenv";
import express from "express";
import mongooseConnection from "./config/mongoose.config";
import cors from "cors";

dotenv.config();

const corsOptions: cors.CorsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

import userRoutes from "./routes/userRoutes";
// import productRoutes from "./routes/productRoutes";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongooseConnection();

app.use("/auth", userRoutes);
// app.use("/product", productRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
