/**
 * Centralized API Service for Technofora '26 FinTech Platform (MONEYCRAFT)
 * Communicates with FastAPI backend on /api endpoints with automatic JWT injection.
 */

const API_BASE = '/api';

/**
 * Helper to make authenticated HTTP requests
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = localStorage.getItem('kavach_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      localStorage.removeItem('kavach_token');
      localStorage.removeItem('kavach_user');
      // Only dispatch event or redirect if not attempting login
      if (!endpoint.includes('/auth/login')) {
        window.dispatchEvent(new CustomEvent('kavach_auth_expired'));
      }
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.detail || `Request failed with status ${response.status}`;
      throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err);
    throw err;
  }
}

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------
export const authApi = {
  login: async (email, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.access_token) {
      localStorage.setItem('kavach_token', data.access_token);
      localStorage.setItem('kavach_user', JSON.stringify(data.user));
    }
    return data;
  },

  register: async ({ email, password, full_name, expected_monthly_savings = 0 }) => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        full_name,
        expected_monthly_savings: Number(expected_monthly_savings) || 0,
      }),
    });
    if (data.access_token) {
      localStorage.setItem('kavach_token', data.access_token);
      localStorage.setItem('kavach_user', JSON.stringify(data.user));
    }
    return data;
  },

  getMe: async () => {
    return await request('/auth/me');
  },

  logout: () => {
    localStorage.removeItem('kavach_token');
    localStorage.removeItem('kavach_user');
  },
};

// -------------------------------------------------------------
// Feature 1: Interactive Financial Dashboard
// -------------------------------------------------------------
export const dashboardApi = {
  getSummary: async () => {
    return await request('/dashboard/');
  },
};

// -------------------------------------------------------------
// Feature 2: Transactions History & Management
// -------------------------------------------------------------
export const transactionsApi = {
  getAll: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.type) searchParams.append('type', params.type);
    if (params.category) searchParams.append('category', params.category);
    if (params.limit) searchParams.append('limit', params.limit);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return await request(`/transactions/${query}`);
  },

  create: async (transactionData) => {
    return await request('/transactions/', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  },

  update: async (id, transactionData) => {
    return await request(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    });
  },

  delete: async (id) => {
    return await request(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },
};

// -------------------------------------------------------------
// Budgets & Boundaries
// -------------------------------------------------------------
export const budgetsApi = {
  getAll: async (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    const query = params.toString() ? `?${params.toString()}` : '';
    return await request(`/budgets/${query}`);
  },

  create: async (budgetData) => {
    return await request('/budgets/', {
      method: 'POST',
      body: JSON.stringify(budgetData),
    });
  },

  getAlerts: async () => {
    return await request('/budgets/alerts');
  },

  delete: async (id) => {
    return await request(`/budgets/${id}`, {
      method: 'DELETE',
    });
  },
};

// -------------------------------------------------------------
// Feature 3: Savings Tracker (General vs Locked Split)
// -------------------------------------------------------------
export const savingsApi = {
  getTracker: async () => {
    return await request('/savings/tracker');
  },
};

// -------------------------------------------------------------
// Feature 5: Personal Financial Goals & Wallet-Transfer
// -------------------------------------------------------------
export const goalsApi = {
  getAll: async () => {
    return await request('/goals/');
  },

  create: async (goalData) => {
    return await request('/goals/', {
      method: 'POST',
      body: JSON.stringify(goalData),
    });
  },

  update: async (id, goalData) => {
    return await request(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(goalData),
    });
  },

  delete: async (id) => {
    return await request(`/goals/${id}`, {
      method: 'DELETE',
    });
  },

  // Wallet-Transfer: Deposit money from General Savings to Goal
  deposit: async (id, amount) => {
    return await request(`/goals/${id}/deposit`, {
      method: 'POST',
      body: JSON.stringify({ amount: Number(amount) }),
    });
  },

  // Wallet-Transfer: Withdraw money from Goal back into General Savings
  withdraw: async (id, amount) => {
    return await request(`/goals/${id}/withdraw`, {
      method: 'POST',
      body: JSON.stringify({ amount: Number(amount) }),
    });
  },

  // Daily Savings Suggestion & Status
  getDailyStatus: async (id) => {
    return await request(`/goals/${id}/daily-status`);
  },
};

// -------------------------------------------------------------
// Feature 6: Financial Education Hub & Daily Shorts
// -------------------------------------------------------------
export const educationApi = {
  getShorts: async () => {
    return await request('/education/shorts');
  },

  getArticles: async () => {
    return await request('/education/articles');
  },

  getArticle: async (id) => {
    return await request(`/education/articles/${id}`);
  },

  getQuiz: async (topic = 'general') => {
    return await request(`/education/quiz/${encodeURIComponent(topic)}`);
  },

  submitQuiz: async (topic = 'general', answers = []) => {
    const formattedAnswers = Array.isArray(answers)
      ? answers
      : Object.entries(answers).map(([qId, optIdx]) => ({
          question_id: Number(qId),
          selected_option_index: Number(optIdx),
        }));

    return await request('/education/quiz/submit', {
      method: 'POST',
      body: JSON.stringify({
        quiz_topic: topic,
        answers: formattedAnswers,
      }),
    });
  },

  getStreak: async () => {
    return await request('/education/streak');
  },

  checkInStreak: async () => {
    return await request('/education/streak/check-in', {
      method: 'POST',
    });
  },
};

// -------------------------------------------------------------
// Feature 4: Financial Security Chatbot & Scam Defense
// -------------------------------------------------------------
export const chatbotApi = {
  sendMessage: async (message, conversationHistory = []) => {
    return await request('/security-chat/', {
      method: 'POST',
      body: JSON.stringify({
        message,
        conversation_history: conversationHistory,
      }),
    });
  },

  getHistory: async () => {
    return await request('/security-chat/history');
  },
};
