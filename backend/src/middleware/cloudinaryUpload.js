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

const proofStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    console.log('📦 Uploading proof image to Cloudinary:', file.originalname); // Debug log
    const eventId = req.params.event_id;
    return {
      folder: `uclm-cares/event-proofs/${eventId}`,
      allowed_formats: ['jpg', 'jpeg', 'png'],
      transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
    };
  },
});

export const proofUpload = multer({ storage: proofStorage })

const idVerificationStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const eventId = req.params.eventId;
    return {
      folder: `uclm-cares/id-verification/${eventId}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
    };
  },
});

export const idVerificationUpload = multer({ storage: idVerificationStorage })