'use client'

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import Image from "next/image"
import { GridPattern } from "./grid-pattern"

type Props = {
  imageUrl: string
  caption: string
  className?: string
  children?: React.ReactNode
  fallbackImageUrl?: string
}

export default function ImageCard({ 
  imageUrl, 
  caption, 
  className, 
  children,
  fallbackImageUrl = "/favicon.ico"
}: Props) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl)

  const handleImageLoad = () => {
    console.log("Image loaded:", currentImageUrl) // Debug log
    setImageLoaded(true)
    setImageError(false)
  }

  const handleImageError = () => {
    console.log("Image error:", currentImageUrl) // Debug log
    setImageError(true)
    setImageLoaded(false)
    if (currentImageUrl !== fallbackImageUrl) {
      setCurrentImageUrl(fallbackImageUrl)
    }
  }

  // Reset loading state when imageUrl changes
  useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
    setCurrentImageUrl(imageUrl)
  }, [imageUrl])

  return (
    <article
  className={cn(
    "group relative w-full max-w-sm overflow-hidden rounded-sm border border-gray-700 bg-white font-base shadow-[5px_0_0_0_rgba(120,0,0,1),0_7px_0_0_rgba(150,0,0,1)] transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
    className,
  )}
>
      {/* Image Container with Loading State */}
      <div className="relative aspect-square overflow-hidden bg-black">
        {/* Grid Pattern Background - always visible */}
        <GridPattern
          className="absolute inset-0 text-blue-400/60 z-0"
          width={24}
          height={24}
          strokeWidth={1.5}
          animate={true}
        />
        
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10">
            <div className="h-8 w-8 animate-spin rounded-full border-1 border-gray-700 border-t-transparent"></div>
          </div>
        )}

        <Image
          className={cn(
            "relative z-20 h-full w-full object-cover transition-all duration-300",
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110",
            "group-hover:scale-105"
          )}
          src={currentImageUrl} 
          alt={caption}
          width={500}
          height={500}
          onLoad={handleImageLoad}
          onError={handleImageError}
          priority={false}
        />
        
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 z-30 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </div>
      
      {/* Header with token name */}
      <div className=" bg-black p-4">
        <h3 className="font-heading text-lg text-white line-clamp-1">
          {caption}
        </h3>
      </div>
      
      {/* Content area */}
      {children && (
        <div className="bg-black p-4">
          {children}
        </div>
      )}
    </article>
  )
}
