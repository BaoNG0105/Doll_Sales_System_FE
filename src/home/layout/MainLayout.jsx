import Header from '../components/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '84px' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default MainLayout