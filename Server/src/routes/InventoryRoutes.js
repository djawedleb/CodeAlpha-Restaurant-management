import express from "express";
import { getInventory,addInventoryItem,updateInventoryItem,deleteInventoryItem } from "../Controllers/InventoryController.js";

const InventoryRouter = express.Router();


InventoryRouter.get("/get" , getInventory);
InventoryRouter.post("/add" , addInventoryItem);
InventoryRouter.put("/update/:id" , updateInventoryItem);
InventoryRouter.delete("/delete/:id" , deleteInventoryItem);

export default InventoryRouter;