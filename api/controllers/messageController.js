import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
   try {
    const {content, receiverId} = req.body;
    
    const newMessage = await Message.create({
        sender: req.user._id,
        receiver: receiverId,
        content
    });
    
    res.status(201).json({success: true, message: newMessage});
    } catch (error) {
        console.log('Error in sendMessage', error);
        res.status(500).json({message: 'Server error'});
        }
}

export const getConversation = async (req, res) => {
    const {userId} = req.params;
    try {
        
        const conversation = await Message.find({
            $or: [
                {sender: req.user._id, receiver: userId},
                {sender: userId, receiver: req.user._id}
            ]
        }).sort('createdAt');
        
        res.status(200).json({success: true, conversation});
    } catch (error) {
        console.log('Error in getConversation', error);
        res.status(500).json({message: 'Server error'});
    }
}
