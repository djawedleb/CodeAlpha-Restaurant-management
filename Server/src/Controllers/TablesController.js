import Tables from "../models/TablesSchema";

export const getTables = async (req , res) =>{
    try{
        const tables = await Tables.find();
        if(tables.length === 0 ) {
            return res.status(404).send("No table Found");
        }
        return res.status(200).json(tables);
    }catch(error){
        console.error(error);
        return res.status(500).send(error.message);
    }
};
export const addTable = async(req ,res) =>{
    try{
    const {body} = req ;
    const newTable = new Tables(body);
    await newTable.save();
    console.log("Table added successfully!!");
    return res.status(201).json({ message: "Order added successfully!", Tables: newTable });
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