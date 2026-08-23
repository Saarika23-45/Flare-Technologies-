import { StrictMode, useState, useEffect, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from '@/context/theme-context'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'

// Always loaded
import ConsultationModal from "@/components/ui/consultation-modal"
import SplashScreen from "@/components/SplashScreen"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import WhatsAppButton from "@/components/WhatsAppButton"
import Home from "@/pages/Home"

// Lazy loaded pages
const Services         = lazy(() => import("@/pages/Services"))
const AllServices      = lazy(() => import("@/pages/AllServices"))
const ServiceDetail    = lazy(() => import("@/pages/ServiceDetail"))
const Methodology      = lazy(() => import("@/pages/Methodology"))
const Results          = lazy(() => import("@/pages/Results"))
const About            = lazy(() => import("@/pages/About"))
const Contact          = lazy(() => import("@/pages/Contact"))
const Careers          = lazy(() => import("@/pages/Careers"))
const Admin            = lazy(() => import("@/pages/Admin"))
const AdminCaseStudies = lazy(() => import("@/pages/AdminCaseStudies"))
const AdminInterns     = lazy(() => import("@/pages/AdminInterns"))
const AdminF2F         = lazy(() => import("@/pages/AdminF2F"))
const CaseStudyEditor  = lazy(() => import("@/pages/CaseStudyEditor"))
const CaseStudyDetail  = lazy(() => import("@/pages/CaseStudyDetail"))
const MainServiceDetail    = lazy(() => import("@/pages/MainServiceDetail"))
const FresherToFinisher    = lazy(() => import("@/pages/FresherToFinisher"))
// --- DISCONNECTED (certificate feature, paused — see offer letter pivot) ---
// const VerifyCertificate    = lazy(() => import("@/pages/VerifyCertificate"))
// --- END DISCONNECTED ---

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      // Wait a tick for the target section to be in the DOM (lazy pages, route change, etc.)
      requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo(0, 0)
        }
      })
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

const PageLoader = () => (
  <div style={{ minHeight: '100vh', background: '#060b17', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid rgba(255,140,0,0.2)', borderTopColor: '#FF8C00', animation: 'spin 0.7s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

function App() {
  const [isConsultationModalOpen, setConsultationModalOpen] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const openModal = () => setConsultationModalOpen(true)
  const closeModal = () => setConsultationModalOpen(false)

  return (
    <HelmetProvider>
      <ThemeProvider>
        {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
        <div style={{ opacity: showSplash ? 0 : 1, transition: 'opacity 0.4s ease' }}>
          <Router>
            <ScrollToTop />
            <Navbar openModal={openModal} />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/"                        element={<Home openModal={openModal} />} />
                <Route path="/home"                    element={<Navigate to="/" replace />} />
                <Route path="/services"                element={<Services openModal={openModal} />} />
                <Route path="/services/all"            element={<AllServices />} />
                <Route path="/services/:slug"          element={<ServiceDetail openModal={openModal} />} />
                <Route path="/methodology"             element={<Methodology openModal={openModal} />} />
                <Route path="/results"                 element={<Results openModal={openModal} />} />
                <Route path="/careers"                 element={<Careers />} />
                <Route path="/contact"                 element={<Contact />} />
                <Route path="/admin"                   element={<Admin />} />
                <Route path="/admin/f2f"               element={<AdminF2F />} />
                <Route path="/admin/interns"           element={<AdminInterns />} />
                <Route path="/admin/case-studies"      element={<AdminCaseStudies />} />
                <Route path="/admin/case-studies/:id"  element={<CaseStudyEditor />} />
                <Route path="/case-studies/:id"        element={<CaseStudyDetail />} />
                <Route path="/main-services/:slug"     element={<MainServiceDetail openModal={openModal} />} />
                <Route path="/about"                   element={<About openModal={openModal} />} />
                <Route path="/fresher-to-finisher"     element={<FresherToFinisher />} />
                {/* --- DISCONNECTED (certificate feature, paused — see offer letter pivot) --- */}
                {/* <Route path="/verify/:id"             element={<VerifyCertificate />} /> */}
                {/* --- END DISCONNECTED --- */}
              </Routes>
            </Suspense>
            <Footer openModal={openModal} />
            <WhatsAppButton />
            <ConsultationModal isOpen={isConsultationModalOpen} onClose={closeModal} />
          </Router>
        </div>
      </ThemeProvider>
    </HelmetProvider>
  )
}

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
