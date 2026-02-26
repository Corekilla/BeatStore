import type { License, LicenseType } from '@/types'

export const LICENSE_DEFINITIONS: Record<LicenseType, Omit<License, 'stripeProductId' | 'stripePriceId'>> = {
  mp3_lease: {
    type: 'mp3_lease',
    label: 'MP3 Lease',
    price: 2999, // $29.99
    description: 'High-quality MP3 for non-exclusive use',
    features: [
      'MP3 (320kbps)',
      'Up to 100k streams',
      'Up to 2,500 sales',
      'Non-exclusive rights',
      'Must credit producer',
    ],
  },
  wav_lease: {
    type: 'wav_lease',
    label: 'WAV Lease',
    price: 4999, // $49.99
    description: 'Uncompressed WAV for professional quality',
    features: [
      'WAV (24-bit)',
      'MP3 included',
      'Up to 500k streams',
      'Up to 5,000 sales',
      'Non-exclusive rights',
      'Must credit producer',
    ],
  },
  trackout: {
    type: 'trackout',
    label: 'Trackout Stems',
    price: 9999, // $99.99
    description: 'Individual stems for full mixing control',
    features: [
      'All stem tracks (WAV)',
      'WAV + MP3 included',
      'Unlimited streams',
      'Unlimited sales',
      'Non-exclusive rights',
      'Must credit producer',
    ],
  },
  exclusive: {
    type: 'exclusive',
    label: 'Exclusive Rights',
    price: 49900, // $499.00
    description: 'Full ownership — beat removed from store',
    features: [
      'All stem tracks (WAV)',
      'WAV + MP3 included',
      'Unlimited streams & sales',
      'Full exclusive rights',
      'No credit required',
      'Beat removed from store',
    ],
  },
}

export function getLicense(type: LicenseType): License {
  return LICENSE_DEFINITIONS[type] as License
}

export const LICENSE_ORDER: LicenseType[] = ['mp3_lease', 'wav_lease', 'trackout', 'exclusive']
