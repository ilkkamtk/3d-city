import { createContext, ReactNode, useState } from 'react';
import useMap from '../hooks/MapHooks';
import { House } from '../types/LocalTypes';

type MapContextType = {
  houses: House[];
  setHouses: React.Dispatch<React.SetStateAction<House[]>>;
  createImage: (url: string) => Promise<number[][] | null>;
  placeHouses: (grid: number[][]) => House[];
};

const MapContext = createContext<MapContextType | null>(null);

const MapProvider = ({ children }: { children: ReactNode }) => {
  const [houses, setHouses] = useState<House[]>([]);
  const { createImage, placeHouses } = useMap();
  return (
    <MapContext.Provider
      value={{ houses, setHouses, createImage, placeHouses }}
    >
      {children}
    </MapContext.Provider>
  );
};

export { MapProvider, MapContext };
