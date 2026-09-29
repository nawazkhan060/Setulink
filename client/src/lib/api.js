const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('setulink_auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = (typeof data === 'object' && data.error) ? data.error : `HTTP ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
};

export const api = {
  // Gateway
  getUnifiedCitizen: (citizenId) => apiRequest(`/api/gateway/citizen/${citizenId}`),
  
  // Applications / Workflows
  getApplications: () => apiRequest('/api/applications'),
  createApplication: (payload) => apiRequest('/api/applications', { method: 'POST', body: JSON.stringify(payload) }),
  advanceApplication: (id, payload) => apiRequest(`/api/applications/${id}/advance`, { method: 'POST', body: JSON.stringify(payload) }),
  
  // Workflows builder
  getWorkflows: () => apiRequest('/api/workflows'),
  createWorkflow: (payload) => apiRequest('/api/workflows', { method: 'POST', body: JSON.stringify(payload) }),
  updateWorkflowSteps: (id, steps) => apiRequest(`/api/workflows/${id}/steps`, { method: 'PUT', body: JSON.stringify({ steps }) }),

  // Consents
  getConsents: (citizenId) => apiRequest(`/api/consent/${citizenId}`),
  toggleConsent: (payload) => apiRequest('/api/consent/toggle', { method: 'POST', body: JSON.stringify(payload) }),

  // Admin
  getAdminMetrics: () => apiRequest('/api/admin/metrics'),
  getConflicts: () => apiRequest('/api/admin/conflicts'),
  resolveConflict: (id, payload) => apiRequest(`/api/admin/conflicts/${id}/resolve`, { method: 'POST', body: JSON.stringify(payload) }),
  getAuditLogs: (params = '') => apiRequest(`/api/admin/audit-logs${params ? `?${params}` : ''}`),
  getExceptions: () => apiRequest('/api/admin/exceptions'),
  resolveException: (id) => apiRequest(`/api/admin/exceptions/${id}/resolve`, { method: 'POST' }),
  getConnectors: () => apiRequest('/api/admin/connectors'),
  toggleConnector: (id, active) => apiRequest(`/api/admin/connectors/${id}/toggle`, { method: 'POST', body: JSON.stringify({ active }) }),

  // Master Registry
  getCitizens: (query = '') => apiRequest(`/api/registry/citizens${query ? `?query=${query}` : ''}`),

  // Notifications
  getNotifications: (userId) => apiRequest(`/api/notifications${userId ? `?userId=${userId}` : ''}`),
  markNotificationRead: (id) => apiRequest(`/api/notifications/${id}/read`, { method: 'POST' }),

  // Mock department preview
  getMockHealth: () => apiRequest('/api/mock/health'),
  getMockTransport: () => apiRequest('/api/mock/transport'),
  getMockMunicipal: () => apiRequest('/api/mock/municipal'),
};
