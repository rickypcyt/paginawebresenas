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
      href={`/category/${category.slug}`}
      className="group relative flex min-h-[140px] flex-col items-center justify-end overflow-hidden rounded-2xl border border-[var(--border)] p-5 text-center shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-[var(--shadow)]"
    >
      {category.imageUrl ? (
        <>
          <img
            src={category.imageUrl}
            alt={category.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-light)] to-[#d1fae5]" />
      )}
      <div className="relative z-10">
        <span className="mb-2 block text-3xl transition-transform duration-200 group-hover:scale-110">
          {category.icon || "🏷️"}
        </span>
        <h3 className="font-semibold text-white drop-shadow-sm">{category.name}</h3>
      </div>
    </Link>
  );
}
