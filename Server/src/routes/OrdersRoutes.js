import { Router } from "express";
import { getOrders,addOrder,updateOrder,deleteOrder } from "../Controllers/OrdersController.js";

const OrdersRouter = Router();

OrdersRouter.get("/get" , getOrders);
OrdersRouter.post("/add" , addOrder);
OrdersRouter.put("/update/:id" , updateOrder);
OrdersRouter.delete("/delete/:id" , deleteOrder);

export default OrdersRouter;