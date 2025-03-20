"use client"

import React, { useState, useRef, MouseEvent, TouchEvent } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react"
import { cn } from "@/lib/utils"
import SectionDivider from "@/components/section-divider"
import { useTouchRipple } from "@/hooks/use-touch-gestures"

interface HeroSectionProps {
  name: string
  intro: string
  profileImage: string
  additionalImages: string[]
}

export default function HeroSection({ name, intro, profileImage, additionalImages }: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const allImages = [profileImage, ...additionalImages]
  const sectionRef = useRef<HTMLDivElement>(null)
  const { createRipple } = useTouchRipple()

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
    setIsZoomed(false)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
    setIsZoomed(false)
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  const handleImageError = () => {
    console.error("Image failed to load:", allImages[currentImageIndex])
    setImageError(true)
  }

  return (
    <div ref={sectionRef} className="min-h-screen flex flex-col items-center justify-center py-20">
      <div className="absolute inset-0 bg-gradient-radial from-blue-50/50 to-transparent opacity-70 pointer-events-none" />

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          className="text-center lg:text-left order-2 lg:order-1 mt-8 sm:mt-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className={cn(
              "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6",
              "bg-clip-text text-transparent bg-gradient-to-r from-[#0f3460] to-[#0f3460]/80",
              "tracking-tight leading-tight"
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {name}
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed max-w-xl mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {intro}
          </motion.p>
        </motion.div>

        <motion.div
          className="flex justify-center order-1 lg:order-2"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <motion.button
                className={cn(
                  "relative cursor-pointer overflow-hidden rounded-2xl",
                  "border-4 border-[#b8860b] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)]",
                  "transition-all duration-300 ease-out w-[280px] h-[350px]"
                )}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.3)",
                  borderColor: "#d4af37",
                }}
                whileTap={{ scale: 0.98 }}
                onTouchStart={(e: TouchEvent) => createRipple(e)}
              >
                <Image
                  src={allImages[currentImageIndex] + "?v=2"}
                  alt={`${name} - Photo ${currentImageIndex + 1}`}
                  width={280}
                  height={350}
                  priority
                  sizes="280px"
                  className="object-cover w-full h-full"
                  onError={handleImageError}
                  unoptimized={true}
                />
                {imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
                    Image failed to load
                  </div>
                )}
              </motion.button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl bg-white/95 backdrop-blur p-0 sm:p-6">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={allImages[currentImageIndex] + "?v=2"}
                  alt={`${name} - Photo ${currentImageIndex + 1}`}
                  fill
                  priority
                  className={cn(
                    "object-contain transition-all duration-300 ease-out",
                    isZoomed ? "scale-150" : "scale-100"
                  )}
                  onError={handleImageError}
                  unoptimized={true}
                />
                {imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
                    Image failed to load
                  </div>
                )}
              </div>

              <div className="absolute top-2 right-2 flex gap-2">
                <Button variant="outline" size="icon" onClick={toggleZoom} className="bg-white/80">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <DialogClose asChild>
                  <Button variant="outline" size="icon" className="bg-white/80">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </div>

              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <Button variant="outline" size="icon" onClick={prevImage} className="bg-white/80">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button variant="outline" size="icon" onClick={nextImage} className="bg-white/80">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>

      <SectionDivider />
    </div>
  )
}
