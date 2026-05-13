type Props = { label: string }

export default function CategoryLabel({ label }: Props) {
  return (
    <span className="text-gold text-xs font-bold uppercase tracking-widest">
      {label}
    </span>
  )
}
