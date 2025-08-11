const postModel = require("../../models/post.model");
const { generateCaption } = require("../../service/ai.service");
const uploadFile = require("../../service/storage.service");
const {v4: uuid4} = require('uuid');


async function createPostController(req,res){
    const file = req.file;
    console.log("file received",file);


    const base64Image = new Buffer.from(file.buffer).toString('base64')
    console.log("base64 Image:",base64Image);
    
    const caption = await generateCaption(base64Image);
    const result = await uploadFile(file.buffer,`${uuid4()}`);

    const post = await postModel.create({
        caption:caption,
        image:result.url,
        user:req.user._id
    })

   
    res.status(201).json({
        message:"post created successfully",
        post
    })

}

async function generateCaptionController(req,res){
    try {
        const file = req.file;
        console.log("file received for caption generation",file);

        if (!file) {
            return res.status(400).json({
                message: "No image file provided"
            });
        }

        const base64Image = new Buffer.from(file.buffer).toString('base64')
        console.log("base64 Image:",base64Image);
        
        const caption = await generateCaption(base64Image);

        res.status(200).json({
            message: "Caption generated successfully",
            caption: caption
        });

    } catch (error) {
        console.error("Error generating caption:", error);
        res.status(500).json({
            message: "Failed to generate caption",
            error: error.message
        });
    }
}

module.exports = {
    createPostController,
    generateCaptionController
}