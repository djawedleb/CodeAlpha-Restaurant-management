import { Router } from "express";
import { getReservations,addReservation,updateReservation,deleteReservation } from "../Controllers/ReservationsController.js";

const ReservationsRouter = Router();

ReservationsRouter.get("/get" , getReservations);
ReservationsRouter.post("/add" , addReservation);
ReservationsRouter.put("/update/:id" , updateReservation);
ReservationsRouter.delete("/delete/:id" , deleteReservation);

export default ReservationsRouter;