const SHAPES = ["square", "rectangle", "circle"] as const;
const DIVIDER_COUNT = 10;

export default function TimelineDivider({ index = 0 }: { index?: number }) {
  const shape = SHAPES[index % SHAPES.length];
  return (
    <div className="timeline-divider" aria-hidden="true">
      {Array.from({ length: DIVIDER_COUNT }).map((_, i) => (
        <span key={i} className={`timeline-divider-mark timeline-divider-mark--${shape}`} />
      ))}
    </div>
  );
}
