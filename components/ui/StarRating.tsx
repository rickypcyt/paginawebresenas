interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ rating, size = "sm" }: StarRatingProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <span
      className={`inline-flex text-[var(--primary)] ${sizeClasses[size]}`}
      aria-label={`Valoración: ${rating} de 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {star <= Math.round(rating) ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}
