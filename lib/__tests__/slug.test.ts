import { describe, it, expect } from "vitest";
import { slugify, generateUniqueSlug } from "@/lib/slug";

describe("slugify", () => {
  it("converts text to slug format", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes accents", () => {
    expect(slugify("Café Heladería")).toBe("cafe-heladeria");
  });

  it("handles special characters", () => {
    expect(slugify("El Pollo Dorado!")).toBe("el-pollo-dorado");
  });

  it("handles multiple spaces and hyphens", () => {
    expect(slugify("  Multiple   Spaces  ")).toBe("multiple-spaces");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("handles numbers", () => {
    expect(slugify("Burger 99")).toBe("burger-99");
  });
});

describe("generateUniqueSlug", () => {
  it("returns base slug when not in existing list", () => {
    expect(generateUniqueSlug("Café del Río", ["other-slug"])).toBe("cafe-del-rio");
  });

  it("appends counter when slug exists", () => {
    expect(generateUniqueSlug("Café del Río", ["cafe-del-rio"])).toBe("cafe-del-rio-2");
  });

  it("increments counter until unique", () => {
    expect(
      generateUniqueSlug("Café del Río", ["cafe-del-rio", "cafe-del-rio-2", "cafe-del-rio-3"])
    ).toBe("cafe-del-rio-4");
  });

  it("handles empty existing list", () => {
    expect(generateUniqueSlug("Test Business", [])).toBe("test-business");
  });
});
