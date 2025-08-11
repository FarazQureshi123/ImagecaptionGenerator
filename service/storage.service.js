    

var ImageKit = require("imagekit");

var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});


 async function uploadFile(fileBuffer,filename){
   

    const response = await imagekit.upload({
        file:fileBuffer,
        fileName:filename,
    })

    return response
 }

 module.exports = uploadFile;