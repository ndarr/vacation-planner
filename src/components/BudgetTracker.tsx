interface Props {
  allowance: number
  usedDays: number
  compact?: boolean
}

function ProgressBar({ used, total, isOverBudget }: { used: number; total: number; isOverBudget: boolean }) {
  const percent = total === 0 ? 0 : Math.min((used / total) * 100, 100)

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
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
      <span className="text-sm text-gray-500 whitespace-nowrap">
        {usedDays} / {allowance} days
      </span>
      <span className={`text-sm font-semibold whitespace-nowrap ${isOverBudget ? 'text-red-500' : 'text-blue-600'}`}>
        {isOverBudget ? `${Math.abs(remaining)}d over` : `${remaining}d left`}
      </span>
    </div>
  )
}

export function BudgetTracker({ allowance, usedDays, compact }: Props) {
  if (compact) return <CompactBudgetTracker allowance={allowance} usedDays={usedDays} />

  const remaining = allowance - usedDays
  const isOverBudget = remaining < 0

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Budget</h2>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>{usedDays} used</span>
        <span>{allowance} total</span>
      </div>
      <ProgressBar used={usedDays} total={allowance} isOverBudget={isOverBudget} />
      <p className={`mt-2 text-sm font-medium ${isOverBudget ? 'text-red-500' : 'text-gray-700'}`}>
        {isOverBudget ? `${Math.abs(remaining)} days over budget` : `${remaining} days remaining`}
      </p>
    </div>
  )
}
