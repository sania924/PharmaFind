'use client';

import { useState, useRef, ChangeEvent } from 'react';
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  Typography,
  Alert,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Image as ImageIcon,
} from '@mui/icons-material';
import { uploadImage, deleteImage, validateImageFile, resizeImage } from '@/lib/firebase/storage';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageDeleted?: () => void;
  storagePath: string; // e.g., 'medicines'
  label?: string;
  required?: boolean;
  maxWidth?: number;
  maxHeight?: number;
}

export default function ImageUpload({
  currentImageUrl,
  onImageUploaded,
  onImageDeleted,
  storagePath,
  label = 'Medicine Image',
  required = false,
  maxWidth = 800,
  maxHeight = 800,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setError(null);

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Resize image before upload to save storage space
      const resizedFile = await resizeImage(file, maxWidth, maxHeight, 0.85);

      // Create preview
      const previewUrl = URL.createObjectURL(resizedFile);
      setPreview(previewUrl);

      // Upload to Firebase Storage
      const downloadUrl = await uploadImage(
        resizedFile,
        storagePath,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);

      // Notify parent component
      onImageUploaded(downloadUrl);
      setPreview(downloadUrl);
      setUploadProgress(100);
    } catch (err: any) {
      console.error('Image upload error:', err);
      const errorMessage = err.message || 'Failed to upload image';

      // Check if it's a storage configuration error
      if (errorMessage.includes('storage/retry-limit-exceeded') ||
          errorMessage.includes('storage/unauthorized') ||
          errorMessage.includes('Not Found')) {
        setError('Image upload is currently unavailable. Firebase Storage is not configured. You can still add the medicine - a placeholder image will be used.');
      } else {
        setError(errorMessage);
      }
      setPreview(null);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!preview) return;

    try {
      setUploading(true);

      // Delete from Firebase Storage if it's not a data URI
      if (!preview.startsWith('data:')) {
        await deleteImage(preview);
      }

      setPreview(null);
      if (onImageDeleted) {
        onImageDeleted();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete image');
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle2" gutterBottom>
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </Typography>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Image preview or upload button */}
      {preview ? (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 400,
            border: '2px dashed #ccc',
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: '#f5f5f5',
          }}
        >
          <img
            src={preview}
            alt="Preview"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 1,
            }}
          >
            <IconButton
              size="small"
              onClick={handleButtonClick}
              disabled={uploading}
              sx={{
                backgroundColor: 'white',
                '&:hover': { backgroundColor: '#f0f0f0' },
              }}
            >
              <CloudUpload />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleDelete}
              disabled={uploading}
              sx={{
                backgroundColor: 'white',
                '&:hover': { backgroundColor: '#ffebee' },
              }}
            >
              <Delete />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box
          onClick={handleButtonClick}
          sx={{
            width: '100%',
            maxWidth: 400,
            height: 200,
            border: '2px dashed #ccc',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: '#fafafa',
            transition: 'all 0.3s',
            '&:hover': {
              borderColor: '#1976d2',
              backgroundColor: '#f0f7ff',
            },
          }}
        >
          <ImageIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
          <Typography variant="body2" color="textSecondary" align="center">
            Click to upload or drag and drop
          </Typography>
          <Typography variant="caption" color="textSecondary" align="center">
            PNG, JPG, GIF, WebP (max 5MB)
          </Typography>
        </Box>
      )}

      {/* Upload progress */}
      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" color="textSecondary" align="center" display="block" mt={1}>
            Uploading: {uploadProgress}%
          </Typography>
        </Box>
      )}

      {/* Error message */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Helper text */}
      <Typography variant="caption" color="textSecondary" display="block" mt={1}>
        Recommended: 800x800px, under 5MB. Images will be automatically resized.
      </Typography>
    </Box>
  );
}
