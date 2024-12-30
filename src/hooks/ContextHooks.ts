import { useContext } from 'react';
import { MapContext } from '../contexts/MapContext';

const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within a DbProvider');
  }
  return context;
};

export { useMapContext };
