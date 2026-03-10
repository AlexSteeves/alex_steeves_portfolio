export default function Skeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height: "40px", borderRadius: "6px" }}
        />
      ))}
    </div>
  );
}
