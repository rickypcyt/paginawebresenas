export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateUniqueSlug(base: string, existingSlugs: string[]): string {
  const baseSlug = slugify(base);
  if (!existingSlugs.includes(baseSlug)) return baseSlug;

  let counter = 2;
  let slug = `${baseSlug}-${counter}`;
  while (existingSlugs.includes(slug)) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
  return slug;
}
