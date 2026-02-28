import { BlobServiceClient } from '@azure/storage-blob';
import { Request, Response, Router } from 'express';
import multer from 'multer';
import { requireAdmin } from '../shared/auth.js';

export const uploadsRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

uploadsRouter.post('/cms-image', requireAdmin, upload.single('file'), async (req: Request, res: Response) => {
  const file = (req as Request & {
    file?: {
      originalname: string;
      buffer: Buffer;
      mimetype: string;
    };
  }).file;
  if (!file) return res.status(400).json({ error: 'Missing file' });

  const account = process.env.AZURE_STORAGE_ACCOUNT;
  const containerName = process.env.CMS_BLOB_CONTAINER || '$web';
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || process.env.STORAGE_CONNECTION_STRING;

  if (!account || !connectionString) {
    return res.status(500).json({ error: 'Blob storage is not configured' });
  }

  const ext = (file.originalname.split('.').pop() || 'jpg').toLowerCase();
  const blobName = `cms/banners/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists({ access: 'blob' });

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadData(file.buffer, {
    blobHTTPHeaders: {
      blobContentType: file.mimetype || 'application/octet-stream',
      blobCacheControl: 'public, max-age=31536000, immutable',
    },
  });

  const url = `https://${account}.blob.core.windows.net/${containerName}/${blobName}`;
  res.status(201).json({ url, blobName });
});
