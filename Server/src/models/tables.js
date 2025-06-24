import mongoose from "mongoose";

const TablesSchema = mongoose.Schema({
    number:{
        type: Number,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
});

const Tables = mongoose.model("Tables" , TablesSchema);

export default Tables;