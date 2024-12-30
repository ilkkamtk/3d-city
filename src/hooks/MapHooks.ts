import { useLoader } from '@react-three/fiber';
import { House } from '../types/LocalTypes';
import { RepeatWrapping, TextureLoader } from 'three';

const useMap = () => {
  const textures = useLoader(TextureLoader, [
    'material1.jpg',
    'material2.jpg',
    'material3.jpg',
  ]);
  const createImage = async (imageFile: string) => {
    return new Promise<number[][] | null>((resolve, reject) => {
      const image = document.createElement('img');
      image.onload = () => resolve(convertImage(image));
      image.onerror = () => reject(null);
      image.setAttribute('src', imageFile);
    });
  };

  const drawImageToCanvas = (image: HTMLImageElement) => {
    if (!image) {
      return null;
    }
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }
    ctx.drawImage(image, 0, 0, image.width, image.height);
    return canvas;
  };

  const convertImage = (image: HTMLImageElement) => {
    const canvas = drawImageToCanvas(image);
    if (!canvas) {
      return null;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }

    const result: number[][] = [];
    for (let y = 0; y < canvas.height; y++) {
      result.push([]);
      for (let x = 0; x < canvas.width; x++) {
        // Get pixel data (RGB values)
        const { data } = ctx.getImageData(x, y, 1, 1);

        // Determine if the pixel is black or white based on RGB values
        const average = (data[0] + data[1] + data[2]) / 3; // Average of R, G, B

        // If average brightness is greater than a threshold, we consider it white (1), otherwise black (0)
        const threshold = 128; // 128 is the midpoint of the 0-255 range, you can adjust the threshold as needed.
        const value = average > threshold ? 1 : 0;

        // Push the 1-bit value (0 or 1) to the result array
        result[y].push(value);
      }
    }
    return result;
  };

  const placeHouses = (grid: number[][]): House[] => {
    if (
      !grid ||
      grid.length === 0 ||
      grid[0].length === 0 ||
      grid.length !== grid[0].length // Assuming grid is square
    ) {
      return [];
    }
    const gridSize = grid.length; // Assuming grid is square
    const houseSize = 30; // House size in pixels
    const placedHouses = []; // Store coordinates of placed houses

    // Iterate through the grid, checking for 2x2 blocks
    for (let y = 0; y < gridSize - houseSize + 1; y++) {
      for (let x = 0; x < gridSize - houseSize + 1; x++) {
        // Check if the current 2x2 block can fit a house
        if (
          grid[y][x] === 1 &&
          grid[y][x + 1] === 1 &&
          grid[y + 1][x] === 1 &&
          grid[y + 1][x + 1] === 1
        ) {
          // Mark the block as "used" (set to 0)
          grid[y][x] = 0;
          grid[y][x + 1] = 0;
          grid[y + 1][x] = 0;
          grid[y + 1][x + 1] = 0;

          // Record the top-left corner of the house, randomize the number of floors, add a texture
          const floors = Math.floor(Math.random() * 10) + 1;
          const originalTexture = textures[Math.floor(Math.random() * 3)];
          const texture = originalTexture.clone(); // Clone the texture for each house
          const width = Math.floor(Math.random() * 3) + 1;
          const length = Math.floor(Math.random() * 3) + 1;

          // Set the texture repeat values based on the house dimensions
          texture.wrapS = RepeatWrapping;
          texture.wrapT = RepeatWrapping;
          texture.repeat.set(width, floors);

          placedHouses.push({ x, y, floors, texture, width, length });
        }
      }
    }

    return placedHouses;
  };

  return { createImage, placeHouses };
};

export default useMap;
