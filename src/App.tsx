
import './App.css'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar } from './shared/components/Navbar'
import { AdminLoginModal } from './shared/components/AdminLoginModal'
import { Hero } from './shared/components/Hero'
import { FeaturedProducts } from './shared/components/FeaturedProducts'
import { MensFashion } from './shared/components/MensFashion'
import { WomensFashion } from './shared/components/WomensFashion'
import { PopularFashion } from './shared/components/popularFashion'
import { FashionCategories } from './shared/components/FashionCategories'
import Footer from './shared/components/Footer'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import Categories from './pages/Categories'
import Login from './pages/Login'
import AdminCategories from './pages/AdminCategories'
import AdminProducts from './pages/AdminProducts'
import AdminProductsList from './pages/AdminProductsList'
import AdminCategoryProducts from './pages/AdminCategoryProducts'
import AdminDashboard from './pages/AdminDashboard'
import AdminNotFound from './pages/AdminNotFound'
import EditProduct from './pages/EditProduct'
import { Routes, Route } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

function App() {
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const location = useLocation();
  
  // Hide navbar for admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <QueryClientProvider client={queryClient}>
      {!isAdminRoute && <Navbar onAdminLoginClick={() => setIsAdminLoginOpen(true)} />}
      {!isAdminRoute && <AdminLoginModal isOpen={isAdminLoginOpen} onClose={() => setIsAdminLoginOpen(false)} />}
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
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/admin/product/:id/edit" element={<EditProduct />} />
        <Route path="/category/:category" element={<Categories />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/products-list" element={<AdminProductsList />} />
        <Route path="/admin/category/:categoryId/products" element={<AdminCategoryProducts />} />
        <Route path="/admin/category/:id/products" element={<AdminProducts />} />
        <Route path="/admin/analytics" element={<AdminNotFound />} />
        <Route path="/admin/settings" element={<AdminNotFound />} />
        <Route path="/admin/orders" element={<AdminNotFound />} />
      </Routes>
      {!isAdminRoute && <Footer />}
      <ReactQueryDevtools initialIsOpen ={false}/>
    </QueryClientProvider>
  )
}

export default App
