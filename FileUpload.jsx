import React, { useState } from 'react';
import axios from '../utils/axiosInstance';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a file');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto mt-8">
      <h2 className="text-xl font-bold">Upload Excel File</h2>
      {message && <div className="text-green-500">{message}</div>}
      {error && <div className="text-red-500">{error}</div>}
      <input type="file" accept=".xls,.xlsx" onChange={handleChange} className="file-input w-full" />
      <button type="submit" className="btn btn-primary w-full">Upload</button>
    </form>
  );
};

export default FileUpload;
