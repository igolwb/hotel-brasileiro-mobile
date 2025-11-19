import { create } from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const URL = process.env.MOBILE_BACK_PORT; // Ajuste para o endpoint da sua API

const useApiStore = create((set) => ({
  clientes: [],
  quartos: [],
  reservas: [],
  loading: false,
  error: null,




  // GET, POST, PUT, DELETE Clientes
  fetchClientes: async (authHeader) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${URL}/api/clientes`, {
        headers: {
          Authorization: authHeader
        }
      });
      set({ clientes: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message || 'Erro ao buscar clientes', loading: false });
    }
  },

  getClienteById: async (id, authHeader) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${URL}/api/clientes/${id}`, {
        headers: {
          Authorization: authHeader
        }
      });
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message || 'Erro ao buscar cliente', loading: false });
    }
  },

  createCliente: async (cliente) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${URL}/api/clientes`, cliente);
      if (response.status === 201 && response.data.success) {
        const { token, data } = response.data;
        if (token) {
          await AsyncStorage.setItem('authToken', token);
        }
        set((state) => ({ clientes: [...state.clientes, data], loading: false }));
        return response.data;
      } else {
        set({ loading: false });
        throw new Error(response.data.message || 'Erro ao criar cliente');
      }
    } catch (error) {
      if (error.response && error.response.headers['content-type'] !== 'application/json') {
        console.error('Unexpected response format:', error.response.data);
        set({ error: 'Unexpected response from the server.', loading: false });
      } else {
        set({ error: error.message || 'Erro ao criar cliente', loading: false });
      }
      throw error;
    }
  },

  updateCliente: async (id, updatedCliente, authHeader) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${URL}/api/clientes/${id}`, updatedCliente, {
        headers: {
          Authorization: authHeader
        }
      });
      set((state) => ({
        clientes: state.clientes.map((cliente) =>
          cliente.id === id ? response.data : cliente
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message || 'Erro ao atualizar cliente', loading: false });
    }
  },

  deleteCliente: async (id, authHeader) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${URL}/api/clientes/${id}`, {
        headers: {
          Authorization: authHeader
        }
      });
      set((state) => ({
        clientes: state.clientes.filter((cliente) => cliente.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message || 'Erro ao deletar cliente', loading: false });
    }
  },

    // Busca reservas de um cliente específico, incluindo nome do quarto
  fetchReservasCliente: async (clienteId, authHeader) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${URL}/api/clientes/${clienteId}/reservas`, {
        headers: {
          Authorization: authHeader
        }
      });
      set({ reservas: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.message || 'Erro ao buscar reservas do cliente', loading: false });
      return [];
    }
  },







  // GET, POST, PUT, DELETE Quartos
  fetchQuartos: async (authHeader) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${URL}/api/quartos`, {
        headers: {
          Authorization: authHeader
        }
      });
      set({ quartos: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message || 'Erro ao buscar quartos', loading: false });
    }
  },

  getQuartoById: async (id, authHeader) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${URL}/api/quartos/${id}`, {
        headers: {
          Authorization: authHeader
        }
      });
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message || 'Erro ao buscar quarto', loading: false });
    }
  },

  createQuarto: async (quarto, authHeader) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${URL}/api/quartos`, quarto, {
        headers: {
          Authorization: authHeader
        }
      });
      set((state) => ({ quartos: [...state.quartos, response.data], loading: false }));
    } catch (error) {
      set({ error: error.message || 'Erro ao criar quarto', loading: false });
    }
  },

  updateQuarto: async (id, updatedQuarto, authHeader) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${URL}/api/quartos/${id}`, updatedQuarto, {
        headers: {
          Authorization: authHeader
        }
      });
      set((state) => ({
        quartos: state.quartos.map((quarto) =>
          quarto.id === id ? response.data : quarto
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message || 'Erro ao atualizar quarto', loading: false });
    }
  },

  deleteQuarto: async (id, authHeader) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${URL}/api/quartos/${id}`, {
        headers: {
          Authorization: authHeader
        }
      });
      set((state) => ({
        quartos: state.quartos.filter((quarto) => quarto.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message || 'Erro ao deletar quarto', loading: false });
    }
  },






  
  // GET, POST, PUT, DELETE Reservas
  fetchReservas: async (authHeader) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${URL}/api/reservas`, {
        headers: {
          Authorization: authHeader
        }
      });
      set({ reservas: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message || 'Erro ao buscar reservas', loading: false });
    }
  },

  getReservaById: async (id, authHeader) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${URL}/api/reservas/${id}`, {
        headers: {
          Authorization: authHeader
        }
      });
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message || 'Erro ao buscar reserva', loading: false });
    }
  },

  createReserva: async (reserva, authHeader) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${URL}/api/reservas`, reserva, {
        headers: {
          Authorization: authHeader
        }
      });
      set((state) => ({ reservas: [...state.reservas, response.data], loading: false }));
    } catch (error) {
      set({ error: error.message || 'Erro ao criar reserva', loading: false });
    }
  },

  updateReserva: async (id, updatedReserva, authHeader) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${URL}/api/reservas/${id}`, updatedReserva, {
        headers: {
          Authorization: authHeader
        }
      });
      set((state) => ({
        reservas: state.reservas.map((reserva) =>
          reserva.id === id ? response.data : reserva
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message || 'Erro ao atualizar reserva', loading: false });
    }
  },

deleteReserva: async (id, authHeader) => {
  set({ loading: true, error: null });
  try {
    await axios.delete(`${URL}/api/reservas/${id}`, {
      headers: {
        Authorization: authHeader
      }
    });
    set((state) => ({
      reservas: state.reservas.filter((reserva) => reserva.id !== id),
      loading: false,
    }));
  } catch (error) {
    set({ error: error.message || 'Erro ao deletar reserva', loading: false });
  }
},

getReservasEstatisticas: async (authHeader) => {
  set({ loading: true, error: null });
  try {
    const response = await axios.get(`${URL}/api/reservas/estatisticas`, {
      headers: {
        Authorization: authHeader
      }
    });
    set({ loading: false });
    return response.data; // contains total_profit, profit_12m, profit_6m, profit_1m, monthly_income
  } catch (error) {
    set({ error: error.message || 'Erro ao buscar estatísticas', loading: false });
    return null;
  }
},
}));

export default useApiStore;
