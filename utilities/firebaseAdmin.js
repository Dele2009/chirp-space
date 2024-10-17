const { bucket } = require("../config/firebase-admin.config");

/**
 * Uploads a file to Firebase Storage.
 * @param {Object} props - function parameters
 * @param {Buffer} fileBuffer - The file buffer from multer.
 * @param {string} destination - The destination path in Firebase Storage.
 * @param {string} mimeType - The file's content type.
 * @returns {string} - uploaded file url path
 */
async function uploadFileToStorage({fileBuffer , destination, mimeType}) {
  const file = bucket.file(destination);
  
  await new Promise((resolve, reject) => {
    const stream = file.createWriteStream({
      metadata: { contentType: mimeType },
      public: true, // Make the file publicly accessible
    });

    stream.end(fileBuffer);

    stream.on('finish', async () => {
      await file.makePublic(); // Ensure the file is public
      console.log(`File uploaded to ${destination}`);
      resolve();
    });

    stream.on('error', (error) => reject(error));
  });

  return `https://storage.googleapis.com/${bucket.name}/${destination}`;
}

/**
 * Deletes a file from Firebase Storage.
 * @param {string} filePath - The path of the file to delete in Firebase Storage.
 * @returns {Promise<void>} - A promise that resolves when the file is deleted.
 */
async function deleteFileFromStorage(filePath) {
  const file = bucket.file(filePath);
  await file.delete();
  console.log(`File ${filePath} deleted successfully.`);
}

module.exports = { uploadFileToStorage, deleteFileFromStorage };
