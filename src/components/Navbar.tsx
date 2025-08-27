'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Eye, 
  ShoppingCart, 
  DollarSign, 
  Briefcase,
  TrendingUp,
  Menu,
  X
} from 'lucide-react'

const Navbar = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const navigationItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      section: 'main'
    },
    {
      name: 'Assets',
      href: '/assets',
      icon: Eye,
      section: 'main'
    },
    {
      name: 'Buy',
      href: '/buy',
      icon: ShoppingCart,
      section: 'trading'
    },
    {
      name: 'Sell',
      href: '/sell',
      icon: DollarSign,
      section: 'trading'
    },
    {
      name: 'Portfolio',
      href: '/portfolio',
      icon: Briefcase,
      section: 'trading'
    }
  ]

  const mainItems = navigationItems.filter(item => item.section === 'main')
  const tradingItems = navigationItems.filter(item => item.section === 'trading')

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className='fixed top-4 left-2 z-50 md:hidden bg-black border border-gray-700 rounded-lg p-2 text-white hover:bg-gray-800 transition-colors'
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? (
          <X className='h-3 w-3' />
        ) : (
          <Menu className='h-3 w-3 md:h-6 md:w-6' />
        )}
      </button>

      {isMobileMenuOpen && (
        <div 
          className='fixed inset-0 bg-black/50 z-40 md:hidden'
          onClick={closeMobileMenu}
        />
      )}

      <div className={`
        fixed md:relative top-0 left-0 z-40 h-full
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        w-64 md:w-full flex flex-col bg-black text-white overflow-hidden border-r border-gray-700
      `}>
      <nav className='flex-1 px-4 py-6 space-y-8 mt-9 md:mt-4'>
        <div className=' pb-8 border-b border-gray-700'>
          <h3 className='px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3'>
            Overview
          </h3>
          <div className='space-y-1'>
            {mainItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center sidebarfont px-3 py-2 text-lg font-semibold rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-red-800 text-white border-l-4 border-red-400' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 transition-colors ${
                    isActive 
                      ? 'text-red-300' 
                      : 'text-muted-foreground group-hover:text-red-400'
                  }`} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>


        <div>
          <h3 className='px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3'>
            Trading
          </h3>
          <div className='space-y-1'>
            {tradingItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center sidebarfont px-3 py-2 text-lg font-semibold rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-red-800 text-white border-l-4 border-red-400' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 transition-colors ${
                    isActive 
                      ? 'text-red-300' 
                      : 'text-muted-foreground group-hover:text-red-400'
                  }`} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <div className='p-4 border-t border-gray-700'>
        <div className='text-center space-y-3'>
          <div className='text-xs text-gray-500 mb-2'>Made by</div>
          <div className='space-y-2'>
            <Link 
              href="https://x.com/mani_yadla_" 
              target="_blank"
              className='block text-sm text-gray-400 hover:text-red-400 transition-colors duration-200'
            >
              @mani_yadla_
            </Link>
            <Link 
              href="https://x.com/AnanyaPappula" 
              target="_blank"
              className='block text-sm text-gray-400 hover:text-red-400 transition-colors duration-200'
            >
              @AnanyaPappula
            </Link>
            
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Navbar
