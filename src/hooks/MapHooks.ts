const useMap = () => {
  const createImage = async (imageFile: string) => {
    return new Promise<number[][] | null>((resolve) => {
      const image = document.createElement('img');
      image.onload = () => resolve(convertImage(image));
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
        const data = ctx.getImageData(x, y, 1, 1).data;

        // Determine if the pixel is black or white based on RGB values
        // Here, we threshold based on the pixel's average value. You can adjust the threshold as needed.
        const average = (data[0] + data[1] + data[2]) / 3; // Average of R, G, B

        // If average brightness is greater than a threshold, we consider it white (1), otherwise black (0)
        const threshold = 128; // 128 is the midpoint of the 0-255 range
        const value = average > threshold ? 1 : 0;

        // Push the 1-bit value (0 or 1) to the result array
        result[y].push(value);
      }
    }
    return result;
  };

  function placeHouses(grid: number[][]) {
    const gridSize = grid.length; // Assuming grid is square (100x100)
    const houseSize = 70; // House size in pixels (2x2)
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

          // Record the top-left corner of the house
          placedHouses.push({ x, y });
        }
      }
    }

    return placedHouses;
  }

  return { createImage, placeHouses };
};

export default useMap;
