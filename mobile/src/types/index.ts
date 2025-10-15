export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  location: string;
  phone?: string;
  profileImage?: string;
}

export interface Hobby {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: number;
  indoorOutdoor: 'indoor' | 'outdoor' | 'both';
  socialIndividual: 'social' | 'individual' | 'both';
  budget: 'low' | 'medium' | 'high';
  imageUrl: string;
  videoUrl?: string;
  benefits: string[];
  requirements: string[];
  curriculum?: {
    week: number;
    title: string;
    content: string;
  }[];
}

export interface Community {
  id: string;
  name: string;
  description: string;
  hobbyId: string;
  location: string;
  schedule: string;
  memberCount: number;
  maxMembers: number;
  imageUrl: string;
  leaderId: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  age: number;
  location: string;
  phone?: string;
}
