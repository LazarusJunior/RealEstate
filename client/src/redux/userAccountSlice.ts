import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { mockUserAccount } from '../mockData/userAccountData';

interface Transaction {
  id: number;
  type: string;
  amount: number;
  createdAt: string;
}

interface UserAccountState {
  balance: number;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: UserAccountState = {
  balance: 0,
  transactions: [],
  loading: false,
  error: null,
};

export const fetchUserAccount = createAsyncThunk(
  'userAccount/fetchUserAccount',
  async () => {
    // Simulating API call with mock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockUserAccount;
  }
);

export const updateBalance = createAsyncThunk(
  'userAccount/updateBalance',
  async ({ amount, type }: { amount: number; type: 'deposit' | 'withdraw' }) => {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newBalance = type === 'deposit' 
      ? mockUserAccount.balance + amount 
      : mockUserAccount.balance - amount;
    
    if (newBalance < 0) {
      throw new Error('Insufficient funds');
    }

    mockUserAccount.balance = newBalance;
    mockUserAccount.transactions.unshift({
      id: mockUserAccount.transactions.length + 1,
      type: type === 'deposit' ? 'Deposit' : 'Withdrawal',
      amount,
      createdAt: new Date().toISOString(),
    });

    return { balance: newBalance };
  }
);

const userAccountSlice = createSlice({
  name: 'userAccount',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAccount.fulfilled, (state, action: PayloadAction<typeof mockUserAccount>) => {
        state.loading = false;
        state.balance = action.payload.balance;
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user account';
      })
      .addCase(updateBalance.fulfilled, (state, action) => {
        state.balance = action.payload.balance;
      });
  },
});

export default userAccountSlice.reducer;

