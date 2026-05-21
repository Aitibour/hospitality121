import Image from 'next/image'

type Props = {
  name: string
  avatar: string
  date: string
  nameColor?: string
  dateColor?: string
}

export default function AuthorLine({ name, avatar, date, nameColor = 'text-gray-900', dateColor = 'text-muted' }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={avatar}
        alt={name}
        width={28}
        height={28}
        className="rounded-full object-cover object-top"
      />
      <span className={`${nameColor} text-sm font-medium`}>{name}</span>
      <span className={`${dateColor} text-sm`}><span aria-hidden="true">· </span>{date}</span>
    </div>
  )
}
