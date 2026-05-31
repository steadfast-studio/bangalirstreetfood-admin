"use client";
import { useState } from "react";
import axios from "axios";

interface UploadResponse {
  uploadUrl: string;
  publicUrl: string;
}

export function useS3Upload() {
  const [activeUploads, setActiveUploads] = useState(0);

  const beginUpload = () => setActiveUploads((count) => count + 1);
  const endUpload = () => setActiveUploads((count) => Math.max(0, count - 1));

  const uploadFile = async (file: File): Promise<string> => {
    beginUpload();
    try {
      const { data } = await axios.post<UploadResponse>("/api/upload", {
        fileName: file.name,
        fileType: file.type,
      });

      await axios.put(data.uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });

      return data.publicUrl;
    } finally {
      endUpload();
    }
  };

  const uploadMultiple = async (files: File[]): Promise<string[]> => {
    if (!files.length) return [];
    return Promise.all(files.map(uploadFile));
  };

  const uploading = activeUploads > 0;

  return { uploadFile, uploadMultiple, uploading };
}
