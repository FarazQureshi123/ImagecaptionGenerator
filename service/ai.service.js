const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable.
const ai = new GoogleGenAI({});

async function generateCaption(base64ImageFile) {
  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageFile,
      },
    },
    { text: "Caption this image." },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config:{
      systemInstructions:
      `
      you are an expert in generating captions for images
      you generate single line caption for image 
      your caption should be short and concise
      you use hashtags and emojis in the caption
      
      `
    }
  });
   return response.text
}

module.exports = {
  generateCaption,
};
