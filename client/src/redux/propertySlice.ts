import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

interface Property {
  id: number;
  name: string;
  description: string;
  location: string;
  targetInvestment: number;
  totalInvestments: number;
}

interface PropertyState {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

const initialState: PropertyState = {
  properties: [],
  loading: false,
  error: null,
};

export const fetchProperties = createAsyncThunk('properties/fetchProperties', async () => {
  const response = await api.get('/getProperties');
  return response.data.properties;
});

export const createProperty = createAsyncThunk(
  'properties/createProperty',
  async (propertyData: Omit<Property, 'id' | 'totalInvestments'>) => {
    const response = await api.post('/createProperty', propertyData);
    return response.data.property;
  }
);

export const deleteProperty = createAsyncThunk('properties/deleteProperty',async (propertyId: number) => {
    await api.delete(`/deleteProperty/${propertyId}`);
    return propertyId;
  }
);

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch properties';
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.properties.push(action.payload);
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.properties = state.properties.filter(property => property.id !== action.payload);
      });
  },
});

export default propertySlice.reducer;