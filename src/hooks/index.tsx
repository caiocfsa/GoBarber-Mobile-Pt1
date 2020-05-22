import React from 'react';

//componente para por em volta dos componentes que só serao exibidos
//apos estar autenticado
import { AuthProvider } from './auth';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
      {children}
  </AuthProvider>
)

export default AppProvider;
