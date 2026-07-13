import http from './http';

export const authApi = {
  login: (payload) => http.post('/auth/login', payload),
  me: () => http.get('/auth/me'),
  createCustomerLogin: (payload) => http.post('/auth/customer-login', payload)
};

export const dashboardApi = {
  summary: () => http.get('/dashboard')
};

export const customerApi = {
  list: (params) => http.get('/customers', { params }),
  create: (payload) => http.post('/customers', payload),
  update: (id, payload) => http.put(`/customers/${id}`, payload),
  remove: (id) => http.delete(`/customers/${id}`)
};

export const milkApi = {
  list: (params) => http.get('/milk', { params }),
  upsert: (payload) => http.post('/milk', payload)
};

export const priceApi = {
  current: () => http.get('/prices/current'),
  update: (payload) => http.post('/prices', payload),
  history: () => http.get('/prices/history')
};

export const paymentApi = {
  list: (params) => http.get('/payments', { params }),
  create: (payload) => http.post('/payments', payload)
};

export const reportApi = {
  daily: (params) => http.get('/reports/daily', { params }),
  weekly: () => http.get('/reports/weekly'),
  monthly: (params) => http.get('/reports/monthly', { params }),
  yearly: (params) => http.get('/reports/yearly', { params })
};

export const billingApi = {
  monthly: (params) => http.get('/billing/monthly', { params }),
  exportPdf: (params) => http.get('/billing/monthly/pdf', { params, responseType: 'blob' }),
  exportExcel: (params) => http.get('/billing/monthly/excel', { params, responseType: 'blob' })
};
