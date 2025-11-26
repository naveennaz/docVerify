export interface User {
  id: number;
  email: string;
  username: string;
  role: 'admin' | 'document_creator' | 'document_uploader' | 'document_approver';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentType {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdBy: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Document {
  id: number;
  title: string;
  fileName: string;
  filePath: string;
  mimeType?: string;
  fileSize?: number;
  documentTypeId: number;
  uploadedBy: number;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: number;
  approvedAt?: string;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
  uploader?: User;
  documentType?: DocumentType;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  username: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
