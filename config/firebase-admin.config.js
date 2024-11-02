import admin from "firebase-admin";
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
     storageBucket: process.env.FIREBASE_BUCKET_URL || 'mashmall.appspot.com', // Replace with your bucket name
});

const verifyIdToken = async (idToken) => {
     try {
          const decodedToken = await admin.auth().verifyIdToken(idToken);
          return decodedToken;
     } catch (error) {
          console.error('Error verifying ID token:', error);
          return null;
     }
};

const bucket = admin.storage().bucket();

export { admin, verifyIdToken, bucket };
