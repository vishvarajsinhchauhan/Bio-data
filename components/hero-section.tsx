"use client"

import React, { useState, useRef, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, MotionStyle, HTMLMotionProps } from "framer-motion"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"
import SectionDivider from "@/components/section-divider"
import { useTouchRipple } from "@/hooks/use-touch-gestures"

interface HeroSectionProps {
  name: string
  intro: string
  profileImage: string
  additionalImages: string[]
}

type MotionSectionProps = HTMLMotionProps<"section">

export default function HeroSection({ name, intro, profileImage, additionalImages }: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [isZoomed, setIsZoomed] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const allImages = [profileImage, ...additionalImages]
  const sectionRef = useRef<HTMLElement>(null)
  const { createRipple } = useTouchRipple()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])

  const nextImage = () => {
    setCurrentImageIndex((prev: number) => (prev + 1) % allImages.length)
    setIsZoomed(false)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev: number) => (prev - 1 + allImages.length) % allImages.length)
    setIsZoomed(false)
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  const imageStyle: MotionStyle = {
    transformOrigin: "center center",
    transition: "transform 8s cubic-bezier(0.22, 1, 0.36, 1)",
  }

  const motionProps: MotionSectionProps = {
    id: "hero",
    ref: sectionRef,
    className: "relative min-h-screen flex flex-col items-center justify-center py-20 overflow-hidden",
  }

  return (
    <motion.section {...motionProps}>
      <div className="absolute inset-0 bg-gradient-radial from-blue-50/50 to-transparent opacity-70 pointer-events-none" />

      <motion.div
        className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        style={{ y, opacity, scale }}
      >
        <motion.div
          className="text-center lg:text-left order-2 lg:order-1 mt-8 sm:mt-0"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.2,
          }}
        >
          <motion.h1
            className={cn(
              "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6",
              "bg-clip-text text-transparent bg-gradient-to-r from-[#0f3460] to-[#0f3460]/80",
              "tracking-tight leading-tight"
            )}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.4,
            }}
          >
            {name}
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed max-w-xl mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.6,
            }}
          >
            {intro}
          </motion.p>
        </motion.div>

        <motion.div
          className="flex justify-center order-1 lg:order-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.4,
          }}
        >
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <motion.div
                className={cn(
                  "relative cursor-pointer overflow-hidden rounded-2xl",
                  "border-4 border-[#b8860b] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)]",
                  "transition-all duration-500 ease-out"
                )}
                style={{ width: "280px", height: "350px" }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.3)",
                  borderColor: "#d4af37",
                }}
                whileTap={{ scale: 0.98 }}
                onTouchStart={(e: ReactTouchEvent<HTMLDivElement>) => createRipple(e)}
              >
                <Image
                  src={allImages[currentImageIndex] || "/placeholder.svg"}
                  alt={`${name} - Photo ${currentImageIndex + 1}`}
                  width={280}
                  height={350}
                  priority
                  sizes="(max-width: 768px) 280px, 350px"
                  className="object-cover transition-transform duration-700 ease-out profile-image"
                  style={imageStyle}
                  onMouseEnter={(e: ReactMouseEvent<HTMLImageElement>) => {
                    e.currentTarget.style.transform = "scale(1.1)"
                  }}
                  onMouseLeave={(e: ReactMouseEvent<HTMLImageElement>) => {
                    e.currentTarget.style.transform = "scale(1.0)"
                  }}
                />
              </motion.div>
            </DialogTrigger>

            <DialogContent className="max-w-4xl bg-white/95 backdrop-blur">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={allImages[currentImageIndex] || "/placeholder.svg"}
                  alt={`${name} - Photo ${currentImageIndex + 1}`}
                  fill
                  priority
                  className={cn(
                    "object-contain transition-all duration-700 ease-out",
                    isZoomed ? "scale-150" : "scale-100"
                  )}
                />
              </div>

              <div className="flex justify-center gap-4 mt-4">
                <Button variant="outline" size="icon" onClick={prevImage}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={toggleZoom}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextImage}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </motion.div>

      <SectionDivider />
    </motion.section>
  )
}
