function SeverityBadge({ severity }) {
  const styles = {
    critical: 'bg-red-500/20 text-red-400 border border-red-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    suggestion: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  }

  const icons = {
    critical: '🔴',
    warning: '🟡',
    suggestion: '🔵',
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[severity] || styles.suggestion}`}>
      {icons[severity]} {severity?.toUpperCase()}
    </span>
  )
}

export default SeverityBadge