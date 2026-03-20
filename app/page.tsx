import { Navbar } from '@/components/ui/Navbar'
import { BeatCatalog } from '@/components/store/BeatCatalog'
import { Hero } from '@/components/ui/Hero'
import { Footer } from '@/components/ui/Footer'
import { TrendingBeats } from '@/components/store/TrendingBeats'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      {/* Mobile-only trending strip — sits just above the catalog so it's seen on scroll */}
      <div className="md:hidden px-6 py-8 border-b border-[var(--border)]">
        <TrendingBeats />
      </div>
      <BeatCatalog />
      <Footer />
    </main>
  )
}
