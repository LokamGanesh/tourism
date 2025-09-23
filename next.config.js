/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'www.jharkhandtourism.gov.in',
      },
      {
        protocol: 'https',
        hostname: 'media.assettype.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'dynamic-media-cdn.tripadvisor.com',
      },
      {
        protocol: 'https',
        hostname: 'travelsetu.com',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.simplotel.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 's7ap1.scene7.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      }
      ,
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      }
      ,
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || 'default-value',
  },
}

module.exports = nextConfig
