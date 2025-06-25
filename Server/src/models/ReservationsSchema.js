import mongoose from "mongoose";

const ReservationsSchema = mongoose.Schema({
    name:{
        type: String,
    },
    table:{
        type: Number,
        required: true,
    },
    date:{
        type: Date,
        required: true,
    },
    time:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
});

const Reservations = mongoose.model("Reservations", ReservationsSchema);

export default Reservations;