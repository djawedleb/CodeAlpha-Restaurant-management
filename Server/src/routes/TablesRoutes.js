import { Router } from "express";
import { getTables,addTable,deleteTable } from "../Controllers/TablesController.js";

const TablesRouter = Router();

TablesRouter.get("/get" , getTables);
TablesRouter.post("/add" , addTable);
TablesRouter.delete("/delete/:id" , deleteTable);

export default TablesRouter;