import React, { useState, useEffect, useRef } from 'react'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close on Escape when menu is open
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen])

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ]

  const handleClick = (e, href) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      const offset = 80 // adjust for fixed navbar height
      const top =
        element.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({
        top,
        behavior: 'smooth',
      })
      setIsOpen(false)
    } else {
      // Fallback: go to href (keeps normal browser behavior)
      setIsOpen(false)
      window.location.href = href
    }
  }

  const navBgClass = scrolled
    ? darkMode
      ? 'bg-slate-900/75 backdrop-blur-sm shadow-sm border-b border-slate-800'
      : 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200'
    : 'bg-transparent'

  return (
    <nav
      role="navigation"
      aria-label="Main"
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${navBgClass}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleClick(e, '#home')}
            className={`text-2xl font-black tracking-tight ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Ben Promkaew
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className={`text-sm font-black tracking-wide uppercase transition-colors px-3 py-2 rounded-md ${
                  darkMode
                    ? 'text-slate-200 hover:text-white hover:bg-slate-800'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </a>
            ))}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-pressed={darkMode}
              className={`p-2 transition-colors ml-4 ${
                darkMode ? 'text-slate-200 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              aria-pressed={darkMode}
              className={`p-2 transition-colors ${
                darkMode ? 'text-slate-200 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsOpen((s) => !s)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className={`p-2 transition-colors ${
                darkMode ? 'text-slate-200 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
            className={`${darkMode ? 'bg-slate-900 border-t border-slate-800' : 'bg-white border-t border-gray-200'} md:hidden`}
          >
            <div className="px-6 pt-4 pb-6 space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className={`block text-sm font-black tracking-wide uppercase transition-colors py-3 px-2 rounded-md ${
                    darkMode
                      ? 'text-slate-200 hover:text-white hover:bg-slate-800'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
