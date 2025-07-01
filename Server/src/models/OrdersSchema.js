import mongoose from "mongoose";

const OrdersSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    table:{
        type: Number,
        required: true,
    },
    totalprice:{
        type: Number,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

const Order = mongoose.model("Order", OrdersSchema);

export default Order;