import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HandicraftsShowcase from '../components/HandicraftsShowcase'

export default function HandicraftsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HandicraftsShowcase />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
