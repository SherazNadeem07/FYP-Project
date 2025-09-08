// Redux/provider/provider.js
'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/store';

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] text-white">Loading...</div>}
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}