import Reservations from "../models/ReservationsSchema.js";


export const getReservations = async(req ,res) =>{
    try{
    const reservations = await Reservations.find();
    if(reservations.length === 0){
        return res.status(404).send("no reservations founded");
    }
    return res.status(200).json(reservations);
   }catch(error){
    console.error(error);
    return res.status(500).send(error.message);
   }
};

export const addReservation = async(req ,res) =>{
    try{
    const {body} = req ;
    const {table , date ,time } = req.body
    const newReservation = new Reservations(body);
    const existingReservation = await Reservations.findOne({table , date ,time });
    if(existingReservation){
       return res.status(409).send("Reservation exists!!")
    }
    await newReservation.save();
    console.log("Reservation added successfully!!");
    return res.status(201).json({ message: "Reservation added successfully!", Reservation: newReservation });
}catch(error){
    console.error(error);
    return res.status(500).send(error.message);
   }
};

export const updateReservation = async (req, res)=>{
    try{
        const {id} = req.params;
        const {body} = req;
        const {table , date ,time } = req.body
        const newReservation = await Reservations.findByIdAndUpdate(id , body , {new: true});
        const existingReservation = await Reservations.findOne({table , date ,time });
        if(existingReservation){
        return res.status(409).send("Reservation exists!!")
        }
        if (!newReservation){
            return res.status(404).send("reservation not found")
        }
        console.log("Reservation updated successfully!!");
        return res.status(200).json({ message: "Reservation updated successfully!", Reservation: newReservation });
    }catch(error){
    console.error(error);
    return res.status(500).send(error.message);
   }
};

export const deleteReservation = async (req , res) => {
    try{
        const {id} = req.params;
        const deletedReservation = await Reservations.findByIdAndDelete(id);
        if (!deletedReservation){
            return res.status(404).send("reservation not found");
        }
        console.log("Reservation deleted successfully!!");
        return res.status(200).json({ message: "Reservation deleted successfully!", Reservation: deletedReservation });
    }catch(error){
    console.error(error);
    return res.status(500).send(error.message);
   }
};