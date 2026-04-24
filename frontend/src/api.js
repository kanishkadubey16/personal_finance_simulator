const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Registration failed');
  return result;
};

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Login failed');
  return result;
};

export const fetchProfile = async () => {
  const res = await fetch(`${API_URL}/profile?_t=${Date.now()}`, { headers: getAuthHeaders() });
  const result = await res.json();
  if (!res.ok) throw { status: res.status, message: result.error || 'Failed to fetch profile' };
  return result;
};

export const updateProfile = async (data) => {
  const res = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw { status: res.status, message: result.error || 'Failed to update profile' };
  return result;
};

export const fetchExpenses = async () => {
  const res = await fetch(`${API_URL}/expenses?_t=${Date.now()}`, { headers: getAuthHeaders() });
  const result = await res.json();
  if (!res.ok) throw { status: res.status, message: result.error || 'Failed to fetch expenses' };
  return result;
};

export const addExpense = async (data) => {
  const res = await fetch(`${API_URL}/expenses`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw { status: res.status, message: result.error || 'Failed to add expense' };
  return result;
};

export const deleteExpense = async (id) => {
  const res = await fetch(`${API_URL}/expenses/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const result = await res.json();
  if (!res.ok) throw { status: res.status, message: result.error || 'Failed to delete expense' };
  return result;
};

export const fetchGoals = async () => {
  const res = await fetch(`${API_URL}/goals?_t=${Date.now()}`, { headers: getAuthHeaders() });
  const result = await res.json();
  if (!res.ok) throw { status: res.status, message: result.error || 'Failed to fetch goals' };
  return result;
};

export const addGoal = async (data) => {
  const res = await fetch(`${API_URL}/goals`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw { status: res.status, message: result.error || 'Failed to add goal' };
  return result;
};

export const deleteGoal = async (id) => {
  const res = await fetch(`${API_URL}/goals/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const result = await res.json();
  if (!res.ok) throw { status: res.status, message: result.error || 'Failed to delete goal' };
  return result;
};

export const updateGoal = async (id, data) => {
  const res = await fetch(`${API_URL}/goals/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw { status: res.status, message: result.error || 'Failed to update goal' };
  return result;
};

export const fetchSimulation = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/simulation?${query}`, { headers: getAuthHeaders() });
  const result = await res.json();
  if (!res.ok) throw { status: res.status, message: result.error || 'Failed to fetch simulation' };
  return result;
};

export const fetchAdvice = async () => {
  const res = await fetch(`${API_URL}/advice`, { headers: getAuthHeaders() });
  const result = await res.json();
  if (!res.ok) throw { status: res.status, message: result.error || 'Failed to fetch advice' };
  return result;
};

export const fetchMe = async () => {
  const res = await fetch(`${API_URL}/auth/me`, { headers: getAuthHeaders() });
  const result = await res.json();
  if (!res.ok) throw { status: res.status, message: result.error || 'Failed to fetch user data' };
  return result;
};
