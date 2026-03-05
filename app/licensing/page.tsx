'use client'

import { Navbar } from "@/components/ui/Navbar"
import { Footer } from '@/components/ui/Footer'


const licenses = [
  {
    type: 'MP3 Lease',
    price: '$29.99',
    available: true,
    highlight: false,
    description: 'Perfect for independent artists releasing on streaming platforms.',
    features: [
      { label: 'File Format', value: 'MP3 (320kbps)' },
      { label: 'Streams', value: '100,000' },
      { label: 'Sales / Downloads', value: '2,500' },
      { label: 'Music Videos', value: '1' },
      { label: 'Radio Stations', value: 'Not permitted' },
      { label: 'Beat Length', value: 'Full length (2+ min)' },
      { label: 'Delivery', value: 'Instant download' },
      { label: 'Producer Credit', value: 'Required' },
      { label: 'Exclusive Rights', value: 'No' },
    ],
  },
  {
    type: 'WAV Lease',
    price: '$49.99',
    available: false,
    highlight: false,
    description: 'Uncompressed audio for professional studio quality.',
    features: [
      { label: 'File Format', value: 'WAV (Uncompressed)' },
      { label: 'Streams', value: '500,000' },
      { label: 'Sales / Downloads', value: '5,000' },
      { label: 'Music Videos', value: '1' },
      { label: 'Radio Stations', value: '1' },
      { label: 'Beat Length', value: 'Full length (2+ min)' },
      { label: 'Delivery', value: 'Instant download' },
      { label: 'Producer Credit', value: 'Required' },
      { label: 'Exclusive Rights', value: 'No' },
    ],
  },
  {
    type: 'Trackout Stems',
    price: '$99.99',
    available: false,
    highlight: false,
    description: 'Individual track stems for full mixing control.',
    features: [
      { label: 'File Format', value: 'WAV Stems (ZIP)' },
      { label: 'Streams', value: 'Unlimited' },
      { label: 'Sales / Downloads', value: 'Unlimited' },
      { label: 'Music Videos', value: 'Unlimited' },
      { label: 'Radio Stations', value: 'Unlimited' },
      { label: 'Beat Length', value: 'Full length (2+ min)' },
      { label: 'Delivery', value: 'Instant download' },
      { label: 'Producer Credit', value: 'Required' },
      { label: 'Exclusive Rights', value: 'No' },
    ],
  },
  {
    type: 'Exclusive Rights',
    price: '$499.00',
    available: true,
    highlight: true,
    description: 'Full ownership. Beat removed from store permanently.',
    features: [
      { label: 'File Format', value: 'MP3 (320kbps)' },
      { label: 'Streams', value: 'Unlimited' },
      { label: 'Sales / Downloads', value: 'Unlimited' },
      { label: 'Music Videos', value: 'Unlimited' },
      { label: 'Radio Stations', value: 'Unlimited' },
      { label: 'Beat Length', value: 'Full length (2+ min)' },
      { label: 'Delivery', value: 'Instant download' },
      { label: 'Producer Credit', value: 'Optional' },
      { label: 'Exclusive Rights', value: 'Yes — yours forever' },
    ],
  },
]

const featureRows = [
  'File Format',
  'Streams',
  'Sales / Downloads',
  'Music Videos',
  'Radio Stations',
  'Beat Length',
  'Delivery',
  'Producer Credit',
  'Exclusive Rights',
]

export default function LicensingPage() {
  return (
    <>
      {/* <Navbar></Navbar> */}
      <main className="min-h-screen bg-background">
          <Navbar/>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-accent font-mono text-sm uppercase tracking-widest mb-3">
            Licensing
          </p>
          <h1 className="font-display text-5xl md:text-6xl mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted max-w-xl mx-auto">
            Every beat is full length (2+ minutes) and delivered instantly after purchase.
            No waiting, no back and forth — just download and create.
          </p>
        </div>

        {/* Mobile Cards */}
        <div className="grid grid-cols-1 gap-6 md:hidden">
          {licenses.map((license) => (
            <div
              key={license.type}
              className={`rounded-lg border p-6 ${
                license.highlight
                  ? 'border-accent bg-surface'
                  : 'border-border bg-surface'
              } ${!license.available ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-display text-xl">{license.type}</h2>
                  <p className="text-muted text-sm mt-1">{license.description}</p>
                </div>
                {!license.available && (
                  <span className="text-[10px] font-mono uppercase tracking-wider border border-border text-muted px-2 py-1 rounded-sm">
                    Coming Soon
                  </span>
                )}
              </div>

              <p className="font-mono text-3xl text-accent mb-6">{license.price}</p>

              <div className="space-y-3">
                {license.features.map((f) => (
                  <div key={f.label} className="flex justify-between text-sm">
                    <span className="text-muted">{f.label}</span>
                    <span className={`font-mono ${
                      f.value === 'Not permitted' ? 'text-muted line-through' :
                      f.value.includes('Unlimited') || f.value === 'Yes — yours forever' ? 'text-accent' :
                      'text-text'
                    }`}>
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>

              {license.available && (
                
                 <a href="/#catalog"
                  className="block w-full text-center mt-6 btn-primary py-2.5 text-sm">

                  Browse Beats
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left py-4 pr-6 text-muted font-mono text-xs uppercase tracking-wider w-40">
                  Feature
                </th>
                {licenses.map((license) => (
                  <th
                    key={license.type}
                    className={`text-center py-4 px-4 ${
                      license.highlight ? 'bg-surface rounded-t-lg' : ''
                    } ${!license.available ? 'opacity-50' : ''}`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {!license.available && (
                        <span className="text-[10px] font-mono uppercase tracking-wider border border-border text-muted px-2 py-0.5 rounded-sm">
                          Coming Soon
                        </span>
                      )}
                      <span className="font-display text-lg">{license.type}</span>
                      <span className="font-mono text-2xl text-accent">{license.price}</span>
                      <p className="text-muted text-xs font-normal max-w-[160px]">
                        {license.description}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureRows.map((row, i) => (
                <tr
                  key={row}
                  className={`border-t border-border ${i % 2 === 0 ? '' : 'bg-surface/30'}`}
                >
                  <td className="py-3 pr-6 text-muted text-sm font-mono">{row}</td>
                  {licenses.map((license) => {
                    const feature = license.features.find((f) => f.label === row)
                    const value = feature?.value ?? '—'
                    return (
                      <td
                        key={license.type}
                        className={`text-center py-3 px-4 text-sm ${
                          license.highlight ? 'bg-surface' : ''
                        } ${!license.available ? 'opacity-50' : ''}`}
                      >
                        <span className={`font-mono ${
                          value === 'Not permitted' ? 'text-muted line-through' :
                          value.includes('Unlimited') || value === 'Yes — yours forever' ? 'text-accent' :
                          'text-text'
                        }`}>
                          {value}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
              {/* CTA Row */}
              <tr className="border-t border-border">
                <td className="py-6" />
                {licenses.map((license) => (
                  <td
                    key={license.type}
                    className={`py-6 px-4 text-center ${
                      license.highlight ? 'bg-surface rounded-b-lg' : ''
                    }`}
                  >
                    {license.available ? (
                      
                        <a href="/#catalog"
                        className="inline-block btn-primary px-6 py-2.5 text-sm">
                        Browse Beats
                        </a>
                      
                    ) : (
                      <span className="text-muted text-sm font-mono">Coming Soon</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl mb-8 text-center">Common Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'What happens after I buy?',
                a: 'You get an instant download link on the confirmation page and via email. No waiting.',
              },
              {
                q: 'Do I need to credit the producer?',
                a: 'Yes for leases — use "Prod. by Corekilla" in your song title or description. Exclusive buyers can optionally drop the credit.',
              },
              {
                q: 'What if I outgrow my lease?',
                a: 'You can upgrade to a higher tier at any time. Just reach out and we\'ll work it out.',
              },
              {
                q: 'Can I use leased beats on YouTube?',
                a: 'Yes — MP3 leases cover up to 1 music video and 100K streams which includes YouTube plays.',
              },
              {
                q: 'What does exclusive mean exactly?',
                a: 'You own the beat outright. It gets removed from the store and no one else can buy it. You get unlimited streams, sales, and radio plays.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-border pb-6">
                <h3 className="font-display text-lg mb-2">{q}</h3>
                <p className="text-muted text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
    <Footer />
    </>
  )
}