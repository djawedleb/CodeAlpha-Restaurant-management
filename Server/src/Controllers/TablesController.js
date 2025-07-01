import Tables from "../models/TablesSchema.js";

export const getTables = async (req , res) =>{
    try{
        const tables = await Tables.find();
        return res.status(200).json(tables);
    }catch(error){
        console.error(error);
        return res.status(500).send(error.message);
    }
};
export const addTable = async(req ,res) =>{
    try{
    const {number} = req.body ;
    const newTable = new Tables(req.body);
    const existingTable = await Tables.findOne({ number });
    if (existingTable) {
        return res.status(409).send("Table already exists!");
    }
    await newTable.save();
    console.log("Table added successfully!!");
    return res.status(201).json({ message: "Table added successfully!", Tables: newTable });
}catch(error){
    console.error(error);
    return res.status(500).send(error.message);
   }
};
export const deleteTable = async (req , res) => {
    try{
        const {id} = req.params;
        const deletedTable = await Tables.findByIdAndDelete(id);
        if (!deletedTable){
            return res.status(404).send("Table Not Found");
        }
        console.log("Table Deleted Successfully!!");
        return res.status(200).json({ message: "Table deleted successfully!", Tables: deletedTable });
    }catch(error){
    console.error(error);
    return res.status(500).send(error.message);
   }
};

export const updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const updatedTable = await Tables.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );
        
        if (!updatedTable) {
            return res.status(404).send("Table Not Found");
        }
        
        console.log("Table Updated Successfully!!");
        return res.status(200).json({ message: "Table updated successfully!", table: updatedTable });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};