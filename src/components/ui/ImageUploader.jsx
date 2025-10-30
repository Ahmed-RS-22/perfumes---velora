import { useState } from "react";
import { supabase } from "../../lib/supabase-client";

export default function ImageUploader({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  // ✅ Handle file select & preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // ✅ Handle upload
  const handleUpload = async () => {
    if (!file) return setError("Please select an image first.");

    setUploading(true);
    setError("");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          upsert: false,
          onUploadProgress: (e) => {
            setProgress(Math.round((e.loaded / e.total) * 100));
          },
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      const imageUrl = publicData.publicUrl;

      // Send to parent (product creation form)
      if (onUploadComplete) onUploadComplete(imageUrl);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-md p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Upload Product Image</h3>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer focus:outline-none file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
      />

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
        </div>
      )}

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
}
