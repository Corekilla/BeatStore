import { Navbar } from '@/components/ui/Navbar'
import { BeatCatalog } from '@/components/store/BeatCatalog'
import { Hero } from '@/components/ui/Hero'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <BeatCatalog />
    </main>
  )
}
