import React, { createContext, useContext, useMemo } from 'react';
import { IRecommendationService } from '../types/recommendations';
import { defaultRemoteRecommendationService, RemoteRecommendationService } from '../services/remoteRecommendationService';
import { useServerConfigStore } from '../store/serverConfigStore';

const RecommendationContext = createContext<IRecommendationService>(defaultRemoteRecommendationService);

interface RecommendationProviderProps {
  service?: IRecommendationService;
  children: React.ReactNode;
}

export const RecommendationProvider: React.FC<RecommendationProviderProps> = ({ 
  service, 
  children 
}) => {
  const recommendationUrl = useServerConfigStore((state) => state.recommendationUrl);

  const activeService = useMemo(() => {
    const s = service || defaultRemoteRecommendationService;
    if (s instanceof RemoteRecommendationService) {
      s.setConfig(recommendationUrl);
    }
    return s;
  }, [service, recommendationUrl]);

  return (
    <RecommendationContext.Provider value={activeService}>
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendationService = (): IRecommendationService => {
  const service = useContext(RecommendationContext);
  if (!service) {
    throw new Error('useRecommendationService must be used within a RecommendationProvider');
  }
  return service;
};
