import { DiscordLogo } from '@phosphor-icons/react'
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
          <DiscordLogo size={24} />
          <span>Join our Discord</span>
        </a>
      </div>
    )
  }

  // Has gallery - show split layout on desktop, centered on mobile
  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile layout */}
      <div className="flex flex-col items-center justify-center p-8 gap-8 lg:hidden">
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
          <DiscordLogo size={24} />
          <span>Join our Discord</span>
        </a>
      </div>

      {/* Desktop: Text on left */}
      <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:w-2/5 lg:p-8 lg:gap-6 lg:border-r lg:border-border">
        <img
          src="/uni_cube_v0.webp"
          alt="Ungineers Calicube"
          className="max-w-xs w-full rounded-lg"
        />

        <p className="text-muted-foreground leading-relaxed">
          A community of makers, tinkerers, and engineers building open-source 3D printers and tools.
        </p>

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
          <DiscordLogo size={24} />
          <span>Join our Discord</span>
        </a>
      </div>

      {/* Desktop: Gallery grid on right - images fill available height without scroll */}
      <div className="hidden lg:block lg:flex-1 lg:p-4">
        <div
          className="grid grid-cols-2 gap-3 h-full"
          style={{ gridTemplateRows: 'repeat(3, 1fr)' }}
        >
          {displayImages.map((img, index) => (
            <div
              key={img}
              className="relative rounded-lg overflow-hidden"
            >
              <img
                src={`/gallery/${img}`}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
