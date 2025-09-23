import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EventsShowcase from '../components/EventsShowcase'

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EventsShowcase />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
