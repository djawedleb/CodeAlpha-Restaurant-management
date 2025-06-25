import mongoose from "mongoose";

const InventorySchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    quantity:{
        type: Number,
    },
    category:{
        type: String,
        required: true,
    },
    image:{
        data: Buffer,
        contentType: String,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
});

const Inventory = mongoose.model("Inventory", InventorySchema);

export default Inventory;