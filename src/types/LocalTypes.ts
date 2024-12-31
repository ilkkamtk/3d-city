import { Texture } from 'three';

type House = {
  x: number;
  y: number;
  floors: number;
  texture: Texture;
  roughnessMap: Texture;
  width: number;
  length: number;
};

type Tree = {
  x: number;
  y: number;
  height: number;
};

export type { House, Tree };
