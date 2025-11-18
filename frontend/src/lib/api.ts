// API client for Flask backend
const API_URL = import.meta.env.VITE_FLASK_API_URL || 'http://localhost:5008';

export const api = {
  // Generic fetch wrapper
  async fetch(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: 'include', // Important for session cookies
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok && response.status !== 400) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response;
  },

  // Auth
  async login(email: string, password: string) {
    return this.fetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async logout() {
    return this.fetch('/logout', { method: 'POST' });
  },

  // AI Report Generator
  async generateReport(data: any) {
    return this.fetch('/ai-report-generator', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Construction Tracker
  async submitConstructionTracker(data: any) {
    return this.fetch('/construction-tracker', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async submitConstructionProgress(data: any) {
    return this.fetch('/construction-tracker-progress', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Pipeline Estimator
  async estimatePipeline(data: any) {
    return this.fetch('/pipeline', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Roof Demo
  async calculateRoofCost(data: FormData) {
    return fetch(`${API_URL}/price`, {
      method: 'POST',
      credentials: 'include',
      body: data, // FormData, no Content-Type header
    });
  },

  // Blog
  async getBlogPosts() {
    return this.fetch('/blog');
  },

  async getBlogPost(slug: string) {
    return this.fetch(`/blog/${slug}`);
  },

  // Contact
  async submitContact(data: any) {
    return this.fetch('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
