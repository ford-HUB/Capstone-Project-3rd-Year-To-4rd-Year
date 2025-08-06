import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    console.log('📦 Uploading file to Cloudinary:', file.originalname); // Debug log
    return {
      folder: 'uclm-cares',
      allowed_formats: ['jpg', 'jpeg', 'png'],
      transformation: [{ width: 600, height: 600, crop: 'limit' }],
    };
  },
});

export const upload = multer({ storage: storage });

const certStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uclm-cares/certificate',
    resource_type: 'raw',
    allowed_formats: ['pdf']
  }
})

export const certUpload = multer({ storage: certStorage })
