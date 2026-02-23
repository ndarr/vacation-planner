interface Props {
  allowance: number
  usedDays: number
}

function ProgressBar({ used, total }: { used: number; total: number }) {
  const percent = total === 0 ? 0 : Math.min((used / total) * 100, 100)
  const isOverBudget = used > total

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all ${isOverBudget ? 'bg-red-500' : 'bg-blue-500'}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

export function BudgetTracker({ allowance, usedDays }: Props) {
  const remaining = allowance - usedDays
  const isOverBudget = remaining < 0

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Budget</h2>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>{usedDays} used</span>
        <span>{allowance} total</span>
      </div>
      <ProgressBar used={usedDays} total={allowance} />
      <p className={`mt-2 text-sm font-medium ${isOverBudget ? 'text-red-500' : 'text-gray-700'}`}>
        {isOverBudget ? `${Math.abs(remaining)} days over budget` : `${remaining} days remaining`}
      </p>
    </div>
  )
}
