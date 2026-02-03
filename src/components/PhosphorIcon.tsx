import * as PhosphorIcons from '@phosphor-icons/react'

interface PhosphorIconProps {
  name: string
  size?: number
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
  className?: string
}

function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

export function PhosphorIcon({ name, size = 20, weight = 'regular', className }: PhosphorIconProps) {
  const iconName = kebabToPascal(name)
  const icons = PhosphorIcons as unknown as Record<string, React.ComponentType<{ size?: number; weight?: string; className?: string }>>
  const Icon = icons[iconName]

  if (!Icon) {
    const Fallback = PhosphorIcons.ArrowFatRight
    return <Fallback size={size} weight={weight} className={className} />
  }

  return <Icon size={size} weight={weight} className={className} />
}
