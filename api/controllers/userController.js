import cloudinary from "../config/cloudinary.js";

export const updateProfile = async (req, res) => {
    try {
        const {image, ...otherData} = req.body;
        
        let updateData = otherData;
        
        if (image) {
            if(image.startsWith('data:image')) {
                try {
                    const uploadedImage = await cloudinary.uploader.upload(image);
                    updateData = {...otherData, image: uploadedImage.secure_url};
                } catch (error) {
                    console.log('Error in uploading image', error);
                    return res.status(400).json({success: false, message: 'Error in uploading image'});
                }
            }
        }
        
        const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({success: true, user: updatedUser});
    }
    catch (error) {
        console.log('Error in updateProfile', error);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
}

