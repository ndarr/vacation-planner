interface Props {
  allowance: number
  usedDays: number
  compact?: boolean
}

function formatDays(days: number): string {
  return days % 1 === 0 ? String(days) : days.toFixed(1)
}

function ProgressBar({ used, total, isOverBudget }: { used: number; total: number; isOverBudget: boolean }) {
  const percent = total === 0 ? 0 : Math.min((used / total) * 100, 100)

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all ${isOverBudget ? 'bg-red-500' : 'bg-blue-500'}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

function CompactBudgetTracker({ allowance, usedDays }: Props) {
  const remaining = allowance - usedDays
  const isOverBudget = remaining < 0

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <ProgressBar used={usedDays} total={allowance} isOverBudget={isOverBudget} />
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {formatDays(usedDays)} / {allowance} days
      </span>
      <span className={`text-sm font-semibold whitespace-nowrap ${isOverBudget ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>
        {isOverBudget ? `${formatDays(Math.abs(remaining))}d over` : `${formatDays(remaining)}d left`}
      </span>
    </div>
  )
}

export function BudgetTracker({ allowance, usedDays, compact }: Props) {
  if (compact) return <CompactBudgetTracker allowance={allowance} usedDays={usedDays} />

  const remaining = allowance - usedDays
  const isOverBudget = remaining < 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Budget</h2>
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
        <span>{formatDays(usedDays)} used</span>
        <span>{allowance} total</span>
      </div>
      <ProgressBar used={usedDays} total={allowance} isOverBudget={isOverBudget} />
      <p className={`mt-2 text-sm font-medium ${isOverBudget ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>
        {isOverBudget
          ? `${formatDays(Math.abs(remaining))} days over budget`
          : `${formatDays(remaining)} days remaining`}
      </p>
    </div>
  )
}
