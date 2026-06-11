export interface StepCardProps {
  step: number;
  title: string;
  body: string;
}

export function StepCard({ step, title, body }: StepCardProps) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{body}</p>
      <span>{String(step).padStart(2, "0")}</span>
    </div>
  );
}
