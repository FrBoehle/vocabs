export function CelebrationLayer({ bursts }) {
  return (
    <div id="celebration-layer" aria-hidden="true">
      {bursts.map((burst) => (
        <span
          key={burst.id}
          className="confetti"
          style={{
            left: `${burst.left}%`,
            top: `${burst.top}%`,
            background: burst.color,
            animationDelay: `${burst.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}
