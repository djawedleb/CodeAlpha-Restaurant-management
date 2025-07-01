import { Router } from "express";
import { getOrders,addOrder,updateOrder,deleteOrder, markOrderComplete } from "../Controllers/OrdersController.js";

const OrdersRouter = Router();

OrdersRouter.get("/get" , getOrders);
OrdersRouter.post("/add" , addOrder);
OrdersRouter.put("/update/:id" , updateOrder);
OrdersRouter.delete("/delete/:id" , deleteOrder);
OrdersRouter.put("/complete/:id", markOrderComplete);

export default OrdersRouter;