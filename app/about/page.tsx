import {Navbar} from '@/components/ui/Navbar'
import {Footer} from '@/components/ui/Footer'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const images = {
  moody: `${SUPABASE_URL}/storage/v1/object/public/previews/about/74B23338-6067-4084-BADE-A198BF10B3DA.JPEG`,
  portrait: `${SUPABASE_URL}/storage/v1/object/public/previews/about/A97D279B-A371-4797-BE35-C093D7ED9A9D.JPEG`,
  baseball: `${SUPABASE_URL}/storage/v1/object/public/previews/about/IMG_3282.JPG`,
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--background)] pb-16">


        {/* Bio + portrait */}
        <section className="mb-24 relative">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${images.moody})` }}
          />
          <div className="absolute inset-0 bg-black/65" />
          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-3xl mb-6 text-white">Who's <span className="text-[var(--accent)]">Corekilla</span>?</h2>
                <div className="space-y-4 text-white/75 leading-relaxed">
                  <p>
                    Born in Upper Darby, PA, raised in Chester, PA, and graduated from Pottsgrove High School,
                    I built a strong foundation in music through the Chester Children's Chorus. Singing in the
                    church choir and being made to learn piano gave me a real understanding of music. I once
                    mentioned to my parents that I wanted a guitar — not seriously — and next thing you know,
                    that was my big gift under the Christmas tree.
                  </p>
                  <p>
                    Once I started playing guitar and connecting the dots between all aspects of music, I was
                    hooked. Everything I learned from piano translated to guitar and vice versa. My brother
                    focused on piano and bass, I focused on guitar, and my stepdad focused on drums — so by 12, I had
                    learned all four instruments.
                  </p>
                  <p>
                    In high school, I reconnected with music after getting FL Studio and plugging in a MIDI
                    keyboard. Since 2015, I've been composing, arranging, mixing, and mastering both my own
                    music and that of local rappers.
                  </p>
                  <p className="text-white font-medium">
                    My music is about the process — whether it's spending hours building a synth from scratch
                    or chopping the perfect sample. This isn't AI slop; it's <a href="/#catalog" className="text-[var(--accent)] underline underline-offset-2 hover:opacity-80 transition-opacity">real energy that you can feel</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-y border-[var(--border)] py-12 mb-24">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10+', label: 'Years Producing' },
              { value: '4', label: 'Instruments' },
              { value: '2015', label: 'Started in FL Studio' },
              { value: '100%', label: 'Human Made' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-4xl font-bold text-accent mb-1">{stat.value}</p>
                <p className="text-xs font-mono uppercase tracking-wider text-[var(--muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Third photo + CTA */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 md:order-1">
              <img
                src={images.portrait}
                alt="Corekilla"
                className="w-full aspect-[3/4] object-cover object-top rounded-sm"
              />
              <div className="absolute -bottom-3 -right-3 w-full h-full border border-[var(--border)] rounded-sm -z-10" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="font-display text-3xl mb-6 text-[var(--text)]">Work With Me</h2>
              <p className="text-[var(--muted)] leading-relaxed mb-8">
                Every beat in this store is crafted with intention. If you're looking for something custom,
                want to discuss an exclusive deal, or just want to connect — reach out directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/#catalog" className="btn-primary text-center">
                  Browse Beats
                </a>
                <a href="mailto:contact@corekilla.com" className="btn-ghost text-center">
                  Get In Touch
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}