import { useLoader } from '@react-three/fiber';
import { House, Tree } from '../types/LocalTypes';
import { RepeatWrapping, TextureLoader } from 'three';

const useMap = () => {
  const textures = useLoader(TextureLoader, [
    'material1.jpg',
    'material2.jpg',
    'material3.jpg',
    'roughness1.jpg',
    'roughness2.jpg',
    'roughness3.jpg',
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

  const placeHouses = (
    grid: number[][],
  ): { placedHouses: House[]; placedTrees: Tree[] } => {
    if (
      !grid ||
      grid.length === 0 ||
      grid[0].length === 0 ||
      grid.length !== grid[0].length
    ) {
      return { placedHouses: [], placedTrees: [] };
    }

    const gridSize = grid.length; // Assuming grid is square
    const houseSize = 2; // House size (in cells)
    const placedHouses: House[] = [];
    const edgeGrid: number[][] = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(0),
    );

    // Helper function to check if a cell is on the edge
    const isOnEdge = (x: number, y: number): boolean => {
      const neighbors = [
        [x - 1, y], // Left
        [x + 1, y], // Right
        [x, y - 1], // Top
        [x, y + 1], // Bottom
      ];

      // Check neighbors
      for (const [nx, ny] of neighbors) {
        if (nx < 0 || ny < 0 || nx >= gridSize || ny >= gridSize) {
          continue; // Skip out-of-bounds neighbors
        }
        if (grid[ny][nx] === 0) {
          return true; // Neighbor is a road (black pixel)
        }
      }
      return false; // Cell is not on the edge
    };

    // Step 1: Iterate through the grid to populate edgeGrid
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        // If the cell is on the edge, set the corresponding cell in edgeGrid to 1
        if (grid[y][x] === 1 && isOnEdge(x, y)) {
          edgeGrid[y][x] = 1;
        }
      }
    }

    // Function to check if the entire house can fit
    const canPlaceHouse = (x: number, y: number): boolean => {
      for (let dy = 0; dy < houseSize; dy++) {
        for (let dx = 0; dx < houseSize; dx++) {
          // Check if we're out of bounds or if the cell is not `1` (unoccupied)
          if (
            y + dy >= gridSize || // Out of bounds vertically
            x + dx >= gridSize || // Out of bounds horizontally
            grid[y + dy][x + dx] !== 1 // Cell not available (not `1`)
          ) {
            return false; // House can't be placed here
          }
        }
      }
      return true; // House can be placed here
    };

    // Iterate through the grid to place houses
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        // If the current cell is on the edge and available for house placement
        if (edgeGrid[y][x] === 1 && canPlaceHouse(x, y)) {
              for (let dy = 0; dy < houseSize; dy++) {
                for (let dx = 0; dx < houseSize; dx++) {
                  grid[y + dy][x + dx] = 0; // Mark these cells as used
                }
              }

              // Randomize house properties
              const floors = Math.floor(Math.random() * houseSize * 5) + 1;
              const randomTexture = Math.floor(Math.random() * 3);
              const originalTexture = textures[randomTexture];
              const originalRoughnessMap = textures[randomTexture + 3];
              const texture = originalTexture.clone();
              const roughnessMap = originalRoughnessMap.clone();
              const width = (Math.floor(Math.random() * 3) + houseSize) / 2;
              const length = (Math.floor(Math.random() * 3) + houseSize) / 2;

              // Set texture properties
              texture.wrapS = RepeatWrapping;
              texture.wrapT = RepeatWrapping;
              texture.repeat.set(width, floors);
              roughnessMap.wrapS = RepeatWrapping;
              roughnessMap.wrapT = RepeatWrapping;
              roughnessMap.repeat.set(width, floors);

              // Add the house to the list
              placedHouses.push({
                x,
                y,
                floors,
                texture,
                width,
                length,
                roughnessMap,
              });
        }

      }
    }

    // Function to check if the entire tree can fit (assuming a tree is a single cell for simplicity)
    const canPlaceTree = (x: number, y: number): boolean => {
      const treeSize = 2; // Example tree size (2x2 cells)

      for (let dy = 0; dy < treeSize; dy++) {
        for (let dx = 0; dx < treeSize; dx++) {
          if (
            y + dy >= gridSize || // Out of bounds vertically
            x + dx >= gridSize || // Out of bounds horizontally
            grid[y + dy][x + dx] !== 1 // Cell not available (not `1`)
          ) {
            return false; // Cannot place tree here
          }
        }
      }
      return true; // Tree can be placed here
    };

    // Function to place trees randomly in unoccupied white areas
    const placeTrees = (grid: number[][], treeCount: number): Tree[] => {
      const placedTrees: Tree[] = [];
      let treesPlaced = 0;

      // Loop until the desired number of trees are placed
      while (treesPlaced < treeCount) {
        // Generate random coordinates within the grid
        const randomX = Math.floor(Math.random() * gridSize);
        const randomY = Math.floor(Math.random() * gridSize);

        // Check if the tree can be placed at the random position
        if (canPlaceTree(randomX, randomY)) {
          // Mark the cell as occupied (set it to 0)
          grid[randomY][randomX] = 0;

          const height = Math.floor(Math.random() * 3) + 1; // Random height for the tree

          // Record the tree's coordinates
          placedTrees.push({ x: randomX, y: randomY, height });
          treesPlaced++; // Increment the number of trees placed
        }
      }

      return placedTrees;
    };

    const placedTrees = placeTrees(grid, 1500);
    return { placedHouses, placedTrees };
  };

  return { createImage, placeHouses };
};

export default useMap;
