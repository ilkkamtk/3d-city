import { createContext, ReactNode, useState } from 'react';
import useMap from '../hooks/MapHooks';
import { House, Tree } from '../types/LocalTypes';

type MapContextType = {
  houses: House[];
  setHouses: React.Dispatch<React.SetStateAction<House[]>>;
  createImage: (url: string) => Promise<number[][] | null>;
  placeHouses: (grid: number[][]) => {
    placedHouses: House[];
    placedTrees: Tree[];
  };
  trees: Tree[];
  setTrees: React.Dispatch<React.SetStateAction<Tree[]>>;
};

const MapContext = createContext<MapContextType | null>(null);

const MapProvider = ({ children }: { children: ReactNode }) => {
  const [houses, setHouses] = useState<House[]>([]);
  const [trees, setTrees] = useState<Tree[]>([]);
  const { createImage, placeHouses } = useMap();
  return (
    <MapContext.Provider
      value={{ houses, setHouses, createImage, placeHouses, trees, setTrees }}
    >
      {children}
    </MapContext.Provider>
  );
};

export { MapProvider, MapContext };
