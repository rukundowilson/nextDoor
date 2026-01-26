
import './App.css'
import { Navbar } from './shared/components/Navbar'
import { Hero } from './shared/components/Hero'
import { FeaturedProducts } from './shared/components/FeaturedProducts'
import { MensFashion } from './shared/components/MensFashion'
import { WomensFashion } from './shared/components/WomensFashion'

function App() {

  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <MensFashion />
      <WomensFashion />
    </>
  )
}

export default App
