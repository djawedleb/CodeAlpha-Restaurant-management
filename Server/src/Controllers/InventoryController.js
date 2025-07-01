import Inventory from "../models/InventorySchema.js";

export const getInventory = async (req , res) => {
    try{
        const inventory = await Inventory.find();
        return res.status(200).json(inventory);
       }catch(error){
        console.error(error);
        return res.status(500).send(error.message);
       }
};

export const addInventoryItem = async(req ,res) =>{
    try{
    const {body} = req ;
    const newItem = new Inventory(body);
    await newItem.save();
    console.log("Item added successfully!!");
    return res.status(201).json({ message: "Item added successfully!", Inventory: newItem });
}catch(error){
    console.error(error);
    return res.status(500).send(error.message);
   }
};

export const updateInventoryItem = async (req, res)=>{
    try{
        const {id} = req.params;
        const {body} = req;
        const updatedItem = await Inventory.findByIdAndUpdate(id , body , {new: true});
        if (!updatedItem){
            return res.status(404).send("Item Not Found")
        }
        console.log("Item updated successfully!!");
        return res.status(200).json({ message: "Item updated successfully!", Inventory: updatedItem });
    }catch(error){
    console.error(error);
    return res.status(500).send(error.message);
   }
};

export const deleteInventoryItem = async (req , res) => {
    try{
        const {id} = req.params;
        const deletedItem = await Inventory.findByIdAndDelete(id);
        if (!deletedItem){
            return res.status(404).send("Item not found");
        }
        console.log("Item deleted successfully!!");
        return res.status(200).json({ message: "Item deleted successfully!", Inventory: deletedItem });
    }catch(error){
    console.error(error);
    return res.status(500).send(error.message);
   }
};
