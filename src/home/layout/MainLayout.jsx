import Header from '../components/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'
import ScrollToTop from '../components/ScrollToTop'
import Chatbot from '../components/Chatbot'

function MainLayout() {
  return (
    <>
      <ScrollToTop />
      <Chatbot />
      <Header />
      <main style={{ paddingTop: '84px' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default MainLayout