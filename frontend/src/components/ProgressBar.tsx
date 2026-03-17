interface ProgressBarProps {
  percent: number;
  label?: string;
}

export default function ProgressBar({ percent, label }: ProgressBarProps) {
  return (
    <div className="progress-wrapper">
      {label && <span className="progress-label">{label}</span>}
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="progress-text">{percent}%</span>
    </div>
  );
}
