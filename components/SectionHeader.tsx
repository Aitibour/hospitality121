type Props = {
  title: string
  description: string
  count: number
  noun: string
  pluralNoun?: string
}

export default function SectionHeader({ title, description, count, noun, pluralNoun }: Props) {
  const label = count !== 1 ? (pluralNoun ?? `${noun}s`) : noun
  return (
    <div className="bg-surface border-b border-muted/20 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-3">{title}</h1>
        <p className="text-muted max-w-xl text-base">{description}</p>
        <p className="text-gold text-sm font-medium mt-4">{count} {label}</p>
      </div>
    </div>
  )
}
