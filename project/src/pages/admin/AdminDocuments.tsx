import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Trash2, Download, Award } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { documentsService } from '../../lib/supabase';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

interface Document {
  id: string;
  type: 'cv' | 'certificate';
  title: string;
  file_url: string;
  file_name: string;
  file_size: number;
  created_at: string;
}

const AdminDocuments: React.FC = () => {
  const { isDark } = useThemeStore();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'cv' | 'certificate'>('cv');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    file: null as File | null,
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await documentsService.getAll();
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm({ ...uploadForm, file });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.title) {
      toast.error('Please provide a title and select a file');
      return;
    }

    setUploading(true);
    try {
      const { publicUrl, fileName, fileSize } = await documentsService.uploadFile(
        uploadForm.file,
        uploadType
      );

      await documentsService.create({
        type: uploadType,
        title: uploadForm.title,
        file_url: publicUrl,
        file_name: fileName,
        file_size: fileSize,
      });

      toast.success('Document uploaded successfully');
      setShowUploadModal(false);
      setUploadForm({ title: '', file: null });
      loadDocuments();
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await documentsService.delete(id);
      toast.success('Document deleted successfully');
      loadDocuments();
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast.error(error.message || 'Failed to delete document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const cvDocuments = documents.filter(d => d.type === 'cv');
  const certificates = documents.filter(d => d.type === 'certificate');

  return (
    <div className={`min-h-screen pt-24 pb-12 transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Documents & Certificates
          </h1>
          <Button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </Button>
        </div>

        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-xl shadow-lg p-6 w-full max-w-md ${
                isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              }`}
            >
              <h2 className="text-2xl font-bold mb-4">Upload Document</h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block mb-2 font-semibold">Document Type</label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value as 'cv' | 'certificate')}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="cv">CV / Resume</option>
                    <option value="certificate">Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Title</label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    placeholder="e.g., My CV 2024, AWS Certificate"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">File</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700`}
                    required
                  />
                  {uploadForm.file && (
                    <p className="text-sm text-gray-500 mt-2">
                      Selected: {uploadForm.file.name} ({formatFileSize(uploadForm.file.size)})
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadForm({ title: '', file: null });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={uploading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Upload
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        <div className="space-y-8">
          <div>
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <FileText className="w-6 h-6" />
              CV / Resume
            </h2>
            {cvDocuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cvDocuments.map((doc) => (
                  <Card key={doc.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg mb-1 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {doc.title}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {doc.file_name}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {formatFileSize(doc.file_size)}
                        </p>
                      </div>
                      <FileText className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="primary" size="sm" className="w-full flex items-center justify-center">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </a>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <FileText className={`w-12 h-12 mx-auto mb-4 ${
                  isDark ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  No CV uploaded yet. Click "Upload Document" to add your CV.
                </p>
              </Card>
            )}
          </div>

          <div>
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Award className="w-6 h-6" />
              Certificates
            </h2>
            {certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificates.map((doc) => (
                  <Card key={doc.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg mb-1 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {doc.title}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {doc.file_name}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {formatFileSize(doc.file_size)}
                        </p>
                      </div>
                      <Award className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="primary" size="sm" className="w-full flex items-center justify-center">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </a>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Award className={`w-12 h-12 mx-auto mb-4 ${
                  isDark ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  No certificates uploaded yet. Click "Upload Document" to add certificates.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDocuments;
