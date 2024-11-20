import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

interface Investment {
  id: number;
  amount: number;
  userId: number;
  propertyId: number;
  createdAt: string;
  property: {
    name: string;
    targetInvestment: number;
  };
  ownershipPercentage: string;
}

interface InvestmentState {
  investments: Investment[];
  loading: boolean;
  error: string | null;
}

const initialState: InvestmentState = {
  investments: [],
  loading: false,
  error: null,
};

export const fetchUserInvestments = createAsyncThunk('investments/fetchUserInvestments', async () => {
  const response = await api.get('/investments/user');
  return response.data;
});

export const fetchAllInvestments = createAsyncThunk('investments/fetchAllInvestments', async () => {
  const response = await api.get('/getAllInvestments');
  return response.data;
});

export const createInvestment = createAsyncThunk(
  'investments/createInvestment',
  async (investmentData: { propertyId: number; amount: number }) => {
    const response = await api.post('/createInvestment', investmentData);
    return response.data.investment;
  }
);

const investmentSlice = createSlice({
  name: 'investments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInvestments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInvestments.fulfilled, (state, action) => {
        state.loading = false;
        state.investments = action.payload;
      })
      .addCase(fetchUserInvestments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch investments';
      })
      .addCase(fetchAllInvestments.fulfilled, (state, action) => {
        state.investments = action.payload;
      })
      .addCase(createInvestment.fulfilled, (state, action) => {
        state.investments.push(action.payload);
      });
  },
});

export default investmentSlice.reducer;