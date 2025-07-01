import Order from "../models/OrdersSchema.js";
import Inventory from "../models/InventorySchema.js";

export const getOrders = async(req ,res) =>{
    try{
    const orders = await Order.find();
    return res.status(200).json(orders);
   }catch(error){
    console.error(error);
    return res.status(500).send(error.message);
   }
};

export const addOrder = async(req ,res) =>{
    try{
    const {body} = req ;
    const newOrder = new Order(body);
    await newOrder.save();
    console.log("Order added successfully!!");
    return res.status(201).json({ message: "Order added successfully!", Order: newOrder });
}catch(error){
    console.error(error);
    return res.status(500).send(error.message);
   }
};

export const updateOrder = async (req, res)=>{
    try{
        const {id} = req.params;
        const {body} = req;
        const existingOrder = await Order.findById(id);
        if (!existingOrder) {
            return res.status(404).send("order not found");
        }
        if (existingOrder.completed) {
            return res.status(403).send("Cannot modify a completed order");
        }
        const newOrder = await Order.findByIdAndUpdate(id , body , {new: true});
        console.log("Order updated successfully!!");
        return res.status(200).json({ message: "Order updated successfully!", Order: newOrder });
    }catch(error){
    console.error(error);
    return res.status(500).send(error.message);
   }
};

export const deleteOrder = async (req , res) => {
    try{
        const {id} = req.params;
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder){
            return res.status(404).send("order not found");
        }
        console.log("Order deleted successfully!!");
        return res.status(200).json({ message: "Order deleted successfully!", Order: deletedOrder });
    }catch(error){
    console.error(error);
    return res.status(500).send(error.message);
   }
};

export const markOrderComplete = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the order
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).send("order not found");
        }
        // Only update if not already completed
        if (!order.completed) {
            // Parse food names (comma-separated)
            const foodNames = order.name.split(',').map(n => n.trim());
            for (const foodName of foodNames) {
                // Find the food item in inventory
                const foodItem = await Inventory.findOne({ name: foodName });
                if (foodItem && foodItem.quantity > 0) {
                    foodItem.quantity -= 1;
                    await foodItem.save();
                }
            }
        }
        // Mark order as completed
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { completed: true },
            { new: true }
        );
        console.log("Order marked as complete and inventory updated!");
        return res.status(200).json({ message: "Order marked as complete! Inventory updated.", Order: updatedOrder });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};