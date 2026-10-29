import React, { createContext, useContext, useMemo } from 'react';
import { IOdooService } from '../types/odoo';
import { defaultOdooService } from '../services/odooService';
import { useServerConfigStore } from '../store/serverConfigStore';

const OdooContext = createContext<IOdooService>(defaultOdooService);

interface OdooProviderProps {
  service?: IOdooService;
  children: React.ReactNode;
}

export const OdooProvider: React.FC<OdooProviderProps> = ({ service, children }) => {
  const odooUrl = useServerConfigStore((state) => state.odooUrl);
  const odooDb = useServerConfigStore((state) => state.odooDb);
  const odooApiKey = useServerConfigStore((state) => state.odooApiKey);

  const activeService = useMemo(() => {
    const s = service || defaultOdooService;
    if (s === defaultOdooService) {
      defaultOdooService.setConfig(odooUrl, odooDb, odooApiKey);
    }
    return s;
  }, [service, odooUrl, odooDb, odooApiKey]);

  return (
    <OdooContext.Provider value={activeService}>
      {children}
    </OdooContext.Provider>
  );
};

export const useOdooService = (): IOdooService => {
  const service = useContext(OdooContext);
  if (!service) {
    throw new Error('useOdooService debe ser utilizado dentro de OdooProvider');
  }
  return service;
};
