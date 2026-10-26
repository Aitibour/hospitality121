export default function FollowCTA({ compact = false }: { compact?: boolean }) {
  return (
    <aside aria-label="Follow Hospitality121" className={compact ? 'mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-100' : 'my-8 rounded-xl border border-gold/30 bg-surface p-5'}>
      <p className={compact ? 'font-medium' : 'mb-3 text-sm text-gray-800'}>
        {compact ? 'Keep up with hotel tech:' : 'What does this change for your hotel? Follow Hospitality121 for practical technology reporting and join the conversation.'}
      </p>
      <div className="flex flex-wrap gap-4 text-sm font-semibold">
        <a href="https://www.linkedin.com/company/hospitality121" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-gold">Follow on LinkedIn ↗</a>
        <a href="https://x.com/hospitality121" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-gold">Follow on X ↗</a>
      </div>
    </aside>
  )
}
