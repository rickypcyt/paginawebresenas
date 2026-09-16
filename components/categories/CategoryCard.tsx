import Link from "next/link";

interface CategoryCardProps {
  category: {
    slug: string;
    name: string;
    icon?: string | null;
    imageUrl?: string | null;
    description?: string | null;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categoria/${category.slug}`}
      className="group flex min-h-[120px] flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-[var(--shadow)]"
    >
      {category.imageUrl ? (
        <>
          <img
            src={category.imageUrl}
            alt={category.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="relative z-10">
            <span className="mb-1.5 block text-3xl drop-shadow-sm">
              {category.icon || "🏷️"}
            </span>
            <h3 className="text-sm font-semibold text-white drop-shadow-sm">{category.name}</h3>
          </div>
        </>
      ) : (
        <>
          <span className="text-3xl transition-transform duration-200 group-hover:scale-110">
            {category.icon || "🏷️"}
          </span>
          <h3 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)]">
            {category.name}
          </h3>
        </>
      )}
    </Link>
  );
}
