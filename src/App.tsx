
import './App.css'
import { Navbar } from './shared/components/Navbar'
import { Hero } from './shared/components/Hero'
import { FeaturedProducts } from './shared/components/FeaturedProducts'
import { MensFashion } from './shared/components/MensFashion'
import { WomensFashion } from './shared/components/WomensFashion'
import { PopularFashion } from './shared/components/popularFashion'
import { FashionCategories } from './shared/components/FashionCategories'
import Footer from './shared/components/Footer'

function App() {

  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <MensFashion />
      <WomensFashion />
      <PopularFashion />
      <FashionCategories />
      <Footer />
    </>
  )
}

export default App
