import { Router } from "express";
import { getTables, addTable, deleteTable, updateTable } from "../Controllers/TablesController.js";

const TablesRouter = Router();

TablesRouter.get("/get" , getTables);
TablesRouter.post("/add" , addTable);
TablesRouter.put("/update/:id" , updateTable);
TablesRouter.delete("/delete/:id" , deleteTable);

export default TablesRouter;