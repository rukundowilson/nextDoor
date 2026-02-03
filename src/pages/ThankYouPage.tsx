import { useNavigate } from "react-router-dom";

export default function ThankYouPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <div className="relative w-full max-w-3xl">
        {/* Decorative background image (replace URL or use CSS) */}
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/asset/img/hero-bg.jpg')" }} />

        {/* Centered white modal */}
        <div className="relative bg-white rounded-lg overflow-hidden">
          {/* Blue top bar */}
          <div className="bg-blue-600 text-white text-center py-6 px-6">
            <h2 className="text-xl md:text-2xl font-semibold">Thank You, We have a</h2>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">Special Gift for You...</h1>
          </div>

          {/* Main coupon content */}
          <div className="p-8 md:p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">GET 50% OFF</h3>
            <p className="text-gray-500 mb-6">Here's your coupon code... but hurry! It expires in 24 hours.</p>

            <div className="mx-auto w-48 md:w-64 mb-8">
              <div className="border-2 border-dashed border-gray-300 rounded-md py-4 px-6 bg-gray-50 select-all">
                <div className="text-sm text-gray-400 mb-1">Your code</div>
                <div className="text-xl md:text-2xl font-semibold tracking-widest text-gray-800">SAVE50</div>
              </div>
            </div>

            <p className="text-gray-500 text-sm mb-8 px-6">
              Please redeem this coupon code on any product within the next 24 hours to receive an instant <span className="font-bold text-orange-500">50% off</span> at checkout.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow-md transition-colors"
              >
                Shop Now
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-transparent border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
              >
                Track Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
