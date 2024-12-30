import { Outlet, NavLink } from 'react-router';

const Layout = () => {
  return (
    <>
      <header className="header">
        <div>
          <img src="vite.svg" alt="logo" />
        </div>
        <div>
          <h1>City</h1>
        </div>
        <div>
          <NavLink to={'/'}>Home</NavLink>
          <NavLink to={'/city'}>City</NavLink>
        </div>
      </header>
      <section className="content">
        <Outlet />
      </section>
    </>
  );
};

export default Layout;
