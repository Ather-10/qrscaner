import './globals.css'

export const metadata = {
  title: 'QR Scanner Pro – Free QR Scanner & Generator',
  description: 'Free QR code scanner and generator. Scan with camera or image, save history.',
}
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#0b1020' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
