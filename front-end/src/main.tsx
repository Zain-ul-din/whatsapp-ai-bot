import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from './lib/theme.ts';
import { AuthProvider } from './hooks/useAuth.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <AuthProvider>
      <App />
    </AuthProvider>
  </ChakraProvider>
);
