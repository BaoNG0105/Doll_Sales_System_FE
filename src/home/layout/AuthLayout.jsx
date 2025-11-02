import { Outlet, Link } from 'react-router-dom';
import '../static/css/Auth.css';

const AuthLayout = () => {
  const videoUrl = 'https://res.cloudinary.com/dygipvoal/video/upload/v1762022212/myhc16ricbztewdpzjcg.mp4';

  return (
    <div className="auth-layout">
      <Link to="/" className="close-button">×</Link>
      
      <video autoPlay loop muted className="background-video">
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <main className="auth-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;