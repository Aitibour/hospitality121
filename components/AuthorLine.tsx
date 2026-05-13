import Image from 'next/image'

type Props = {
  name: string
  avatar: string
  timeAgo: string
}

export default function AuthorLine({ name, avatar, timeAgo }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={avatar}
        alt={name}
        width={28}
        height={28}
        className="rounded-full object-cover"
      />
      <span className="text-white text-sm font-medium">{name}</span>
      <span className="text-muted text-sm"><span aria-hidden="true">· </span>{timeAgo}</span>
    </div>
  )
}
