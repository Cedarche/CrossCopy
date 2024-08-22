// src/hooks/useFetchData.test.js
import React from "react";
// src/hooks/useFetchData.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { useFetchData } from './useFetchData';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the firebase/database module
jest.mock('firebase/database', () => ({
  ref: jest.fn(),
  onValue: jest.fn(),
}));

// Mock the firebase module itself
jest.mock('../firebase', () => ({
  auth: {
    currentUser: { uid: 'test-user-id' },
  },
  database: {},
  trackViews: jest.fn(), // Mock trackViews as a function
}));

describe('useFetchData', () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('should correctly trigger Firebase onValue callback', async () => {
    const mockUserData = {
      autoCopy: false,
      deleteFilesAfter: "7days",
      email: "lU0gtDPqUUWdNxBCm4Wttf8kzvj2@crosscopy.dev",
      history: {
        "1724243659956": {
          encryptedData: "ab96a66c8e317f7d234588b63807339e40247f6e04f2872d928f292b770e2b8a31d251a7849d06c65cd357d947dd9f87e",
          iv: "b6ceafa8ce29eff985f38b068cddc09",
        },
      },
      linkingCode: 1863092,
      paidUser: false,
      saveHistory: true,
      text: "<p>Welcome to Cross Copy - Type or paste here</p>",
    };

    const onValueMock = jest.fn((ref, callback) => {
      callback({ val: () => mockUserData });
    });

    require('firebase/database').onValue.mockImplementation(onValueMock);

    const { result } = renderHook(() => useFetchData(), { wrapper });

    await waitFor(() => expect(result.current.userData).toEqual(mockUserData));
    expect(result.current.paidUser).toBe(false);
    expect(require('../firebase').trackViews).toHaveBeenCalledWith("HomePage");
  });
});
