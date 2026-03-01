import { randomUUID } from 'crypto';
import { BlobServiceClient } from '@azure/storage-blob';
import { getSecret } from './keyvault.js';

function getFileExtension(name: string): string {
  const idx = name.lastIndexOf('.');
  if (idx <= 0 || idx === name.length - 1) return '';
  return name.slice(idx).replace(/[^a-zA-Z0-9.]/g, '').toLowerCase();
}

function normalizeBaseUrl(url?: string): string | null {
  if (!url) return null;
  return url.replace(/\/+$/, '');
}

async function resolveStorageConnectionString(): Promise<string> {
  try {
    return await getSecret('storage-connection-string');
  } catch {
    const fallback =
      process.env.STORAGE_CONNECTION_STRING ||
      process.env.AZURE_STORAGE_CONNECTION_STRING ||
      process.env.AzureWebJobsStorage;

    if (!fallback) {
      throw new Error('Storage connection string not configured. Set storage-connection-string in Key Vault or STORAGE_CONNECTION_STRING/AzureWebJobsStorage in app settings.');
    }

    return fallback;
  }
}

export async function uploadCmsImageToBlob(file: File): Promise<string> {
  const maxBytes = (Number(process.env.CMS_IMAGE_MAX_MB || '10') || 10) * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`File too large. Max allowed is ${Math.round(maxBytes / (1024 * 1024))}MB`);
  }

  const connectionString = await resolveStorageConnectionString();
  const containerName = process.env.CMS_IMAGE_CONTAINER || 'cms-images';
  const publicBaseUrl = normalizeBaseUrl(process.env.STORAGE_PUBLIC_BASE_URL);

  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists({ access: 'blob' });

  const originalName = file.name || 'cms-image';
  const ext = getFileExtension(originalName);
  const date = new Date().toISOString().slice(0, 10);
  const blobName = `cms/${date}/${Date.now()}-${randomUUID()}${ext}`;

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const data = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || 'application/octet-stream';

  await blockBlobClient.uploadData(data, {
    blobHTTPHeaders: {
      blobContentType: contentType,
      blobCacheControl: 'public, max-age=31536000, immutable',
    },
  });

  if (publicBaseUrl) {
    return `${publicBaseUrl}/${containerName}/${blobName}`;
  }

  return blockBlobClient.url;
}
