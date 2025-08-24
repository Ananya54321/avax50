'use client'

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps {
  className?: string
  children: React.ReactNode
}

interface DialogHeaderProps {
  children: React.ReactNode
}

interface DialogTitleProps {
  children: React.ReactNode
}

interface DialogDescriptionProps {
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open, onOpenChange])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-md"
        onClick={() => onOpenChange(false)}
      />
      {children}
    </div>,
    document.body
  )
}

export function DialogContent({ className, children }: DialogContentProps) {
  return (
    <div
      className={cn(
        "relative z-50 w-full max-w-lg mx-4 max-h-[85vh] overflow-auto",
        "border-1 border-gray-700 rounded-base",
        "shadow-2xl drop-shadow-2xl",
        "shadow-black/50 drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)]",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  )
}

export function DialogHeader({ children }: DialogHeaderProps) {
  return (
    <div className="flex flex-col space-y-1.5 p-6 pb-4">
      {children}
    </div>
  )
}

export function DialogTitle({ children }: DialogTitleProps) {
  return (
    <h3 className="font-heading text-lg leading-none tracking-tight text-main-foreground">
      {children}
    </h3>
  )
}

export function DialogDescription({ children }: DialogDescriptionProps) {
  return (
    <p className="text-sm text-main-foreground/70">
      {children}
    </p>
  )
}

interface DialogTriggerProps {
  asChild?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export function DialogTrigger({ children, onClick }: DialogTriggerProps) {
  return (
    <div onClick={onClick}>
      {children}
    </div>
  )
}
