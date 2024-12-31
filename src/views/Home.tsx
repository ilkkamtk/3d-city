import { useEffect } from 'react';
import { useMapContext } from '../hooks/ContextHooks';

const Home = () => {
  const { createImage, placeHouses, setHouses, houses, trees, setTrees } =
    useMapContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('image');
    if (file instanceof File) {
      const grid = await createImage(URL.createObjectURL(file));
      if (!grid) {
        return;
      }
      const { placedHouses, placedTrees } = placeHouses(grid);
      setHouses(placedHouses);
      setTrees(placedTrees);
    }
  };

  useEffect(() => {
    if (houses.length) {
      console.log(houses);
    }
    if (trees.length) {
      console.log(trees);
    }
  }, [houses, trees]);

  return (
    <div className="home">
      <h1>Home</h1>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="file-input">Upload map image</label>
            <input type="file" name="image" accept="image/*" id="file-input" />
          </div>
          <div className="form-group">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
