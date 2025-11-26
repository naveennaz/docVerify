'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { FileText, FolderPlus, Upload, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDocuments: 0,
    pendingDocuments: 0,
    approvedDocuments: 0,
    documentTypes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [documentsRes, documentTypesRes] = await Promise.all([
        api.get('/documents'),
        api.get('/document-types'),
      ]);

      const documents = documentsRes.data;
      setStats({
        totalDocuments: documents.length,
        pendingDocuments: documents.filter((d: any) => d.status === 'pending').length,
        approvedDocuments: documents.filter((d: any) => d.status === 'approved').length,
        documentTypes: documentTypesRes.data.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Documents',
      value: stats.totalDocuments,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Pending Approval',
      value: stats.pendingDocuments,
      icon: Upload,
      color: 'bg-yellow-500',
    },
    {
      title: 'Approved',
      value: stats.approvedDocuments,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      title: 'Document Types',
      value: stats.documentTypes,
      icon: FolderPlus,
      color: 'bg-purple-500',
    },
  ];

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {user?.username}!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {user?.role === 'admin' || user?.role === 'document_creator' ? (
            <a
              href="/document-types"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow transition-all"
            >
              <FolderPlus className="h-5 w-5 text-blue-600 mr-3" />
              <span className="font-medium">Manage Document Types</span>
            </a>
          ) : null}
          {user?.role === 'admin' || user?.role === 'document_uploader' ? (
            <a
              href="/upload"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow transition-all"
            >
              <Upload className="h-5 w-5 text-blue-600 mr-3" />
              <span className="font-medium">Upload Document</span>
            </a>
          ) : null}
          <a
            href="/documents"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow transition-all"
          >
            <FileText className="h-5 w-5 text-blue-600 mr-3" />
            <span className="font-medium">View Documents</span>
          </a>
          {user?.role === 'admin' || user?.role === 'document_approver' ? (
            <a
              href="/approvals"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow transition-all"
            >
              <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
              <span className="font-medium">Approve Documents</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
