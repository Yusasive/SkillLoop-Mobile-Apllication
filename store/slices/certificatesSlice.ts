import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiService } from '@/services/ApiService';
import { NFTService } from '@/services/NFTService';

interface Certificate {
  id: string;
  sessionId: string;
  tutorName: string;
  skill: string;
  completedAt: string;
  progress: number;
  metadata: {
    title: string;
    description: string;
    image?: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
  nftData?: {
    tokenId: string;
    contractAddress: string;
    txHash: string;
    mintedAt: string;
  };
  isMinted: boolean;
}

interface CertificatesState {
  certificates: Certificate[];
  loading: boolean;
  error: string | null;
  mintingCertificates: string[];
}

const initialState: CertificatesState = {
  certificates: [],
  loading: false,
  error: null,
  mintingCertificates: [],
};

export const fetchCertificates = createAsyncThunk(
  'certificates/fetchCertificates',
  async (_, { rejectWithValue }) => {
    try {
      const data = await ApiService.get('/certificates');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const mintCertificate = createAsyncThunk(
  'certificates/mintCertificate',
  async (certificateId: string, { rejectWithValue, dispatch }) => {
    try {
      dispatch(addMintingCertificate(certificateId));
      
      const certificate = await ApiService.get(`/certificates/${certificateId}`);
      const nftData = await NFTService.mintCertificate(certificate);
      
      // Update certificate with NFT data
      const updatedCertificate = await ApiService.patch(`/certificates/${certificateId}`, {
        nftData,
        isMinted: true,
      });
      
      dispatch(removeMintingCertificate(certificateId));
      return updatedCertificate;
    } catch (error) {
      dispatch(removeMintingCertificate(certificateId));
      return rejectWithValue(error.message);
    }
  }
);

export const shareCertificate = createAsyncThunk(
  'certificates/shareCertificate',
  async (certificateId: string, { rejectWithValue }) => {
    try {
      const shareData = await ApiService.post(`/certificates/${certificateId}/share`);
      return shareData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const certificatesSlice = createSlice({
  name: 'certificates',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addMintingCertificate: (state, action) => {
      state.mintingCertificates.push(action.payload);
    },
    removeMintingCertificate: (state, action) => {
      state.mintingCertificates = state.mintingCertificates.filter(
        id => id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Certificates
      .addCase(fetchCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.certificates = action.payload;
      })
      .addCase(fetchCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Mint Certificate
      .addCase(mintCertificate.fulfilled, (state, action) => {
        const certificateIndex = state.certificates.findIndex(
          cert => cert.id === action.payload.id
        );
        if (certificateIndex !== -1) {
          state.certificates[certificateIndex] = action.payload;
        }
      })
      .addCase(mintCertificate.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, addMintingCertificate, removeMintingCertificate } = certificatesSlice.actions;
export default certificatesSlice.reducer;