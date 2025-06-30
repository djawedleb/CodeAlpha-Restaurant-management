import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import InventoryRouter from "./routes/InventoryRoutes.js";
import OrdersRouter from "./routes/OrdersRoutes.js";
import TablesRouter from "./routes/TablesRoutes.js";
import ReservationsRouter from "./routes/ReservationsRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
connectDb();
app.use(express.json());
app.use(cors());

app.use('/api/Inventory ' , InventoryRouter);
app.use('/api/Tables' , TablesRouter);
app.use('/api/Reservations' , ReservationsRouter);
app.use('/api/Orders' , OrdersRouter);


app.get("/", (req, res) => {
    res.json({ message: "server is running" });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

export default app;