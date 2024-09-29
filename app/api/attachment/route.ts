// import { createRouter } from 'next-connect';
// import multer from 'multer';
// import AWS from 'aws-sdk';
// import type { NextApiRequest, NextApiResponse } from 'next';

// // Extend multer's File interface
// const upload = multer();
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// // Create a router instance
// const apiRoute = createRouter<NextApiRequest, NextApiResponse>();

// // Middleware for error handling
// apiRoute.use((req, res, next) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }
//   next();
// });

// // Use multer for file uploads
// apiRoute.use(upload.single('image'));

// apiRoute.post(async (req, res) => {
//   // Now TypeScript recognizes req.file
//   const fileContent = Buffer.from(req.file.buffer, 'binary');
//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: `${Date.now()}-${req.file.originalname}`,
//     Body: fileContent,
//     ContentType: req.file.mimetype,
//     ACL: 'public-read',
//   };

//   try {
//     const data = await s3.upload(params).promise();
//     const imageUrl = data.Location;

//     res.status(200).json({ message: 'Image uploaded successfully!', imageUrl });
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     res.status(500).json({ error: 'Error uploading image to S3', details: error.message });
//   }
// });

// // Custom error handling for unhandled errors
// apiRoute.use((error: any, req, res) => {
//   res.status(501).json({ error: `Something went wrong! ${error.message}` });
// });

// export default apiRoute;

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
