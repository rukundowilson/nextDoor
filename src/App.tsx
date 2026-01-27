
import './App.css'
import { Navbar } from './shared/components/Navbar'
import { Hero } from './shared/components/Hero'
import { FeaturedProducts } from './shared/components/FeaturedProducts'
import { MensFashion } from './shared/components/MensFashion'
import { WomensFashion } from './shared/components/WomensFashion'
import { PopularFashion } from './shared/components/popularFashion'
import { FashionCategories } from './shared/components/FashionCategories'
import Footer from './shared/components/Footer'
import Shop from './pages/Shop'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <FeaturedProducts />
              <MensFashion />
              <WomensFashion />
              <PopularFashion />
              <FashionCategories />
            </>
          }
        />
        <Route path="/shop" element={<Shop />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
