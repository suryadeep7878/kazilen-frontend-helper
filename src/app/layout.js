// src/app/layout.js
import './globals.css'
import BottomNav from './components/BottomNav'
import LocationLoader from './components/LocationLoader';
import Providers from './providers';
import NetworkStatus from '../components/NetworkStatus';
import AuthGuard from './components/AuthGuard';
import LayoutWrapper from './components/LayoutWrapper';

export const metadata = {
	title: "Kazilen",
	description: "lo siento",
	manifest:"/manifest.json"
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <NetworkStatus />
        <Providers>
          <LocationLoader />
          <AuthGuard>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </AuthGuard>
          <BottomNav /> {/* Always included, but self-hides on other pages */}
        </Providers>
      </body>
    </html>
  )
}
