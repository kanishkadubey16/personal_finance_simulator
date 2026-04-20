const API_URL = 'http://localhost:5001/api';

const getAuthHeaders = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return {
    'Content-Type': 'application/json',
    ...(userInfo?.token && { Authorization: `Bearer ${userInfo.token}` })
  };
};

export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const fetchProfile = async () => {
  const res = await fetch(`${API_URL}/profile?_t=${Date.now()}`, { headers: getAuthHeaders() });
  return res.json();
};

export const updateProfile = async (data) => {
  const res = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const fetchExpenses = async () => {
  const res = await fetch(`${API_URL}/expenses?_t=${Date.now()}`, { headers: getAuthHeaders() });
  return res.json();
};

export const addExpense = async (data) => {
  const res = await fetch(`${API_URL}/expenses`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteExpense = async (id) => {
  const res = await fetch(`${API_URL}/expenses/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
};

export const fetchGoals = async () => {
  const res = await fetch(`${API_URL}/goals?_t=${Date.now()}`, { headers: getAuthHeaders() });
  return res.json();
};

export const addGoal = async (data) => {
  const res = await fetch(`${API_URL}/goals`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteGoal = async (id) => {
  const res = await fetch(`${API_URL}/goals/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
};

export const updateGoal = async (id, data) => {
  const res = await fetch(`${API_URL}/goals/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const fetchSimulation = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/simulation?${query}`, { headers: getAuthHeaders() });
  return res.json();
};

export const fetchAdvice = async () => {
  const res = await fetch(`${API_URL}/advice`, { headers: getAuthHeaders() });
  return res.json();
};
