import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Search, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const VectorDBManager = () => {
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const getAuthHeaders = () => ({
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      'Content-Type': 'application/json'
    }
  });

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/admin/vector-db/documents', getAuthHeaders());
      setDocuments(response.data?.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load documents');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['.pdf', '.txt', '.json', '.epub'];
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!validTypes.includes(ext)) {
        setError('Invalid file type. Supported: PDF, TXT, JSON, EPUB');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await axios.post('/api/v1/admin/vector-db/upload', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(`File uploaded successfully! Created ${response.data?.data?.chunks_created || 0} chunks.`);
      setSelectedFile(null);
      setError(null);
      
      // Reload documents
      setTimeout(() => loadDocuments(), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docName) => {
    if (!window.confirm(`Delete "${docName}"? This cannot be undone.`)) {
      return;
    }

    try {
      await axios.delete(`/api/v1/admin/vector-db/documents/${docName}`, getAuthHeaders());
      setSuccess(`Document "${docName}" deleted successfully`);
      setError(null);
      
      // Reload documents
      setTimeout(() => loadDocuments(), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Enter a search query');
      return;
    }

    try {
      setSearching(true);
      const response = await axios.post('/api/v1/admin/vector-db/search', 
        { query: searchQuery, limit: 5 },
        getAuthHeaders()
      );
      
      setSearchResults(response.data?.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
      setSearchResults(null);
    } finally {
      setSearching(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Clear ALL documents from vector DB? This cannot be undone!')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete('/api/v1/admin/vector-db/clear', getAuthHeaders());
      setSuccess('Vector DB cleared successfully');
      setError(null);
      
      setTimeout(() => loadDocuments(), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Clear failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Upload Section */}
      <div className="glass dark:glass-dark rounded-xl p-6">
        <h3 className="text-lg font-bold text-light-primary dark:text-dark-primary mb-4">
          📤 Upload Documents to Knowledge Base
        </h3>
        
        <p className="text-light-body dark:text-dark-body text-sm mb-4">
          Supported formats: PDF, TXT, JSON, EPUB. Documents will be indexed and available to the AI psychiatrist.
        </p>

        {/* Error Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 mt-0.5" size={18} />
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Success Messages */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg flex items-start gap-3">
            <CheckCircle className="text-green-600 dark:text-green-400 mt-0.5" size={18} />
            <p className="text-green-700 dark:text-green-300 text-sm">{success}</p>
          </div>
        )}

        {/* File Upload */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-light-accent dark:border-dark-accent rounded-lg p-6 text-center hover:bg-light-secondary/5 dark:hover:bg-dark-secondary/5 transition-colors">
            <input
              type="file"
              id="file-input"
              onChange={handleFileSelect}
              accept=".pdf,.txt,.json,.epub"
              className="hidden"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-2 text-light-accent dark:text-dark-accent" />
              <p className="text-light-body dark:text-dark-body font-semibold">
                {selectedFile ? selectedFile.name : 'Click to select or drag & drop'}
              </p>
              <p className="text-light-body dark:text-dark-body text-sm mt-1">
                PDF, TXT, JSON, or EPUB files
              </p>
            </label>
          </div>

          {selectedFile && (
            <div className="p-4 bg-light-secondary/10 dark:bg-dark-secondary/10 rounded-lg flex items-center justify-between">
              <span className="text-light-body dark:text-dark-body text-sm">
                <span className="font-semibold">{selectedFile.name}</span>
                <span className="ml-2 text-xs">({(selectedFile.size / 1024).toFixed(2)} KB)</span>
              </span>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-red-500 hover:text-red-700 text-sm font-semibold"
              >
                Change
              </button>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-light-accent to-light-primary dark:from-dark-accent dark:to-dark-primary text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload Document
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="glass dark:glass-dark rounded-xl p-6">
        <h3 className="text-lg font-bold text-light-primary dark:text-dark-primary mb-4">
          🔍 Search Knowledge Base
        </h3>

        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="flex-1 px-4 py-2 rounded-lg border-2 border-light-accent dark:border-dark-accent bg-light-background dark:bg-dark-background text-light-headings dark:text-dark-headings focus:outline-none"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {searching ? <Loader size={18} className="animate-spin" /> : <Search size={18} />}
          </button>
        </div>

        {/* Search Results */}
        {searchResults && (
          <div className="mt-6">
            <h4 className="font-semibold text-light-primary dark:text-dark-primary mb-3">
              Found {searchResults.results_count} results
            </h4>
            <div className="space-y-3">
              {searchResults.results.map((result, idx) => (
                <div key={idx} className="p-4 bg-light-secondary/10 dark:bg-dark-secondary/10 rounded-lg">
                  <p className="text-sm text-light-body dark:text-dark-body">{result.content}</p>
                  <p className="text-xs text-light-accent dark:text-dark-accent mt-2">
                    📁 {result.source} (Chunk {result.chunk_index + 1})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Documents List Section */}
      <div className="glass dark:glass-dark rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-light-primary dark:text-dark-primary">
            📚 Knowledge Base Documents
          </h3>
          {documents && documents.total_documents > 0 && (
            <button
              onClick={handleClear}
              className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-all"
            >
              Clear All
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader size={24} className="animate-spin text-light-accent dark:text-dark-accent" />
          </div>
        ) : documents && documents.total_documents > 0 ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-light-secondary/10 dark:bg-dark-secondary/10 rounded-lg text-center">
                <p className="text-light-body dark:text-dark-body text-sm">Total Chunks</p>
                <p className="text-2xl font-bold text-light-accent dark:text-dark-accent mt-2">
                  {documents.total_chunks}
                </p>
              </div>
              <div className="p-4 bg-light-secondary/10 dark:bg-dark-secondary/10 rounded-lg text-center">
                <p className="text-light-body dark:text-dark-body text-sm">Documents</p>
                <p className="text-2xl font-bold text-light-accent dark:text-dark-accent mt-2">
                  {documents.total_documents}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {Object.entries(documents.documents).map(([docName, docInfo]) => (
                <div key={docName} className="p-4 bg-light-secondary/10 dark:bg-dark-secondary/10 rounded-lg flex items-center justify-between hover:shadow-md transition-all">
                  <div>
                    <p className="font-semibold text-light-primary dark:text-dark-primary text-sm">
                      📄 {docName}
                    </p>
                    <p className="text-xs text-light-body dark:text-dark-body mt-1">
                      Type: <span className="font-semibold">{docInfo.type}</span> | 
                      Chunks: <span className="font-semibold">{docInfo.chunks}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(docName)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-light-body dark:text-dark-body mb-2">No documents in knowledge base yet</p>
            <p className="text-light-body dark:text-dark-body text-sm">
              Upload documents above to expand the AI's knowledge
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VectorDBManager;
