import Order from "../models/OrdersSchema.js";

export const getOrders = async(req ,res) =>{
    try{
    const orders = await Order.find();
    if(orders.length === 0){
        return res.status(404).send("no orders founded");
    }
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
        const newOrder = await Order.findByIdAndUpdate(id , body , {new: true});
        if (!newOrder){
            return res.status(404).send("order not found")
        }
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