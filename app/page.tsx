import { Navbar } from '@/components/ui/Navbar'
import { BeatCatalog } from '@/components/store/BeatCatalog'
import { Hero } from '@/components/ui/Hero'
import { Footer } from '@/components/ui/Footer'


export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <BeatCatalog />
      <Footer />
    </main>
  )
}
