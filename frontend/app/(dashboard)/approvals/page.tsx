'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, FileText } from 'lucide-react';
import { Document } from '@/types';

export default function ApprovalsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [approvalData, setApprovalData] = useState({
    status: 'approved' as 'approved' | 'rejected',
    remarks: '',
  });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  const fetchPendingDocuments = async () => {
    try {
      const response = await api.get('/documents');
      const pending = response.data.filter((doc: Document) => doc.status === 'pending');
      setDocuments(pending);
    } catch (error) {
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (doc: Document, status: 'approved' | 'rejected') => {
    setSelectedDoc(doc);
    setApprovalData({ status, remarks: '' });
    setIsModalOpen(true);
  };

  const handleSubmitApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoc) return;

    try {
      await api.patch(`/documents/${selectedDoc.id}/approve`, approvalData);
      toast.success(
        `Document ${approvalData.status === 'approved' ? 'approved' : 'rejected'} successfully`
      );
      setIsModalOpen(false);
      setSelectedDoc(null);
      setApprovalData({ status: 'approved', remarks: '' });
      fetchPendingDocuments();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Operation failed');
    }
  };

  // Pagination
  const totalPages = Math.ceil(documents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = documents.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Document Approvals</h1>
        <p className="text-gray-600 mt-1">Review and approve pending documents</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uploaded By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                      <div className="text-sm text-gray-500">{doc.fileName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.documentType?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.uploader?.username || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleApprove(doc, 'approved')}
                    className="text-green-600 hover:text-green-900 mr-4"
                    title="Approve"
                  >
                    <CheckCircle className="h-5 w-5 inline" />
                  </button>
                  <button
                    onClick={() => handleApprove(doc, 'rejected')}
                    className="text-red-600 hover:text-red-900"
                    title="Reject"
                  >
                    <XCircle className="h-5 w-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {documents.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No pending documents for approval.
          </div>
        )}

        {documents.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={documents.length}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDoc(null);
        }}
        title={`${approvalData.status === 'approved' ? 'Approve' : 'Reject'} Document`}
      >
        <form onSubmit={handleSubmitApproval} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm font-medium text-gray-700">Document: {selectedDoc?.title}</p>
            <p className="text-sm text-gray-500 mt-1">File: {selectedDoc?.fileName}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks {approvalData.status === 'rejected' && '*'}
            </label>
            <textarea
              required={approvalData.status === 'rejected'}
              value={approvalData.remarks}
              onChange={(e) => setApprovalData({ ...approvalData, remarks: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={
                approvalData.status === 'rejected'
                  ? 'Please provide reason for rejection...'
                  : 'Optional remarks...'
              }
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedDoc(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md text-white ${
                approvalData.status === 'approved'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {approvalData.status === 'approved' ? 'Approve' : 'Reject'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
