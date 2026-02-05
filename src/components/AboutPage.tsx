import { DiscordLogoIcon } from '@phosphor-icons/react'
import { useState, useEffect, useMemo } from 'react'

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function AboutPage() {
  const [galleryImages, setGalleryImages] = useState<string[] | null>(null)

  useEffect(() => {
    fetch('/gallery-manifest.json')
      .then(res => res.json())
      .then((images: string[]) => setGalleryImages(images))
      .catch(() => setGalleryImages([]))
  }, [])

  const displayImages = useMemo(() => {
    if (!galleryImages) return []
    return shuffleArray(galleryImages).slice(0, 6)
  }, [galleryImages])

  // Loading state
  if (galleryImages === null) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    )
  }

  const hasGallery = displayImages.length > 0

  // No gallery images - show original centered layout
  if (!hasGallery) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
        <img
          src="/uni_cube_v0.webp"
          alt="Ungineers Calicube"
          className="max-w-md w-full rounded-lg"
        />

        <a
          href="https://www.printables.com/model/634840-ungineers-calicube"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          calicube
        </a>

        <a
          href="https://discord.com/invite/MBcHGUv2CB"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <DiscordLogoIcon size={24} />
          <span>Join our Discord</span>
        </a>
      </div>
    )
  }
  // Has gallery - show split layout on desktop, centered on mobile
  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden justify-center">
      {/* Mobile layout */}
      <div className="flex flex-col items-center p-8 gap-5 lg:hidden overflow-hidden">
          <div className="text-center max-w-sm">
            <p className="text-muted-foreground leading-relaxed">
              A community of makers, tinkerers, and engineers building open-source 3D printers and tools.
            </p>
          </div>
          <a
            href="https://discord.com/invite/MBcHGUv2CB"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <DiscordLogoIcon size={24} />
            <span>Join our Discord</span>
          </a>
          <a href="https://www.printables.com/model/634840-ungineers-calicube" target="_blank" rel="noopener noreferrer">
            <img
              src="/uni_cube_v0.webp"
              alt="Ungineers Calicube"
              className="max-w-md w-full rounded-md"
            />

            <p className="justify-center flex text-md p-1 text-blue-800">Ungineers calicube on printables</p>
          </a>

      </div>
      {/* Desktop: Text on left */}
      <div className="hidden lg:flex w-full h-full">
        
        {/* Info text is fixed */}
        <div className="w-1/1.5 flex flex-col items-center justify-center gap-4 p-12 border-r border-border shrink-0">


          <div className="text-center space-y-4 max-w-sm">
            <p className="text-muted-foreground leading-relaxed">
              A community of makers, tinkerers, and engineers building open-source 3D printers and tools.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <a
              href="https://discord.com/invite/MBcHGUv2CB"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <DiscordLogoIcon size={24} />
              <span>Join our Discord</span>
            </a>
            <a href="https://www.printables.com/model/634840-ungineers-calicube" target="_blank" rel="noopener noreferrer">
              <img
              src="/uni_cube_v0.webp"
              alt="Ungineers Calicube"
              className="max-w-md w-full rounded-lg shadow-xl cursor-pointer"
            />
          <p className="justify-center flex text-xs p-1 text-gray-600 hover:text-blue-500 transition-colors">Ungineers calicube on printables</p>
          </a>
          </div>
        </div>

        {/* Desktop: Gallery grid that is scrollable */}
        <div className="w-1/2.5 overflow-y-auto p-8 bg-zinc-950/50 Scroll">
          <div className="grid grid-cols-2 gap-4">
            {displayImages.map((img, index) => (
              <div
                key={`${img}-${index}`}
                className="relative aspect-square rounded-xl overflow-hidden group"
              >
                <img
                  src={`/gallery/${img}`}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}