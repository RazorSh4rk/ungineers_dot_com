import { DiscordLogo } from '@phosphor-icons/react'

export function AboutPage() {
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
