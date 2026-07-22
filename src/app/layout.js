// src/app/layout.js
import './globals.css'
import BottomNav from './components/BottomNav'
import LocationLoader from './components/LocationLoader';
import Providers from './providers';
import NetworkStatus from '../components/NetworkStatus';
import LayoutWrapper from './components/LayoutWrapper';
import BackgroundPoller from './components/poller';
import { AuthProvider } from '@/context/AuthContext';
import AuthModal from './components/AuthModal';

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
          <AuthProvider>
            <BackgroundPoller />
            <LocationLoader />
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <BottomNav /> {/* Always included, but self-hides on other pages */}
            <AuthModal />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
