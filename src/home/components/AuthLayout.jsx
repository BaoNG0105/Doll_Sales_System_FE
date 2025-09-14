import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <>
      <video autoPlay muted loop id="background-video">
        <source src="src/home/static/video/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <main style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;