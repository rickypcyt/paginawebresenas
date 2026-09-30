export type CheckoutProduct = {
  id: string;
  product: "tag_a" | "plan_starter" | "plan_business" | "plan_business_plus" | "plan_enterprise";
  name: string;
  description: string;
  /** Total fijo para productos sin cantidad (tag-a). */
  amount?: number;
  /** Para planes: cargo mensual (primer mes) + precio por tag según tier. */
  monthly?: number;
  tagPrice?: number;
  minEmployees?: number;
  maxEmployees?: number;
};

export const CHECKOUT_PRODUCTS: Record<string, CheckoutProduct> = {
  "tag-a": {
    id: "tag-a",
    product: "tag_a",
    name: "Tag NFC Toque Público (Tipo A)",
    description: "Tag NFC que redirige a la ficha de Google Reviews de tu negocio. Pago único, sin suscripción.",
    amount: 40,
  },
  starter: {
    id: "starter",
    product: "plan_starter",
    name: "Plan Starter · Toque Personal",
    description: "1–5 empleados. Incluye el primer mes de servicio y un tag NFC por empleado.",
    monthly: 19.99,
    tagPrice: 20,
    minEmployees: 1,
    maxEmployees: 5,
  },
  business: {
    id: "business",
    product: "plan_business",
    name: "Plan Negocio · Toque Personal",
    description: "6–10 empleados. Incluye el primer mes de servicio y un tag NFC por empleado.",
    monthly: 29.99,
    tagPrice: 15,
    minEmployees: 6,
    maxEmployees: 10,
  },
  "business-plus": {
    id: "business-plus",
    product: "plan_business_plus",
    name: "Plan Negocio Plus · Toque Personal",
    description: "11–20 empleados. Incluye el primer mes de servicio y un tag NFC por empleado.",
    monthly: 49.99,
    tagPrice: 12,
    minEmployees: 11,
    maxEmployees: 20,
  },
  enterprise: {
    id: "enterprise",
    product: "plan_enterprise",
    name: "Plan Empresarial · Toque Personal",
    description: "21–50 empleados. Incluye el primer mes de servicio y un tag NFC por empleado.",
    monthly: 79.99,
    tagPrice: 10,
    minEmployees: 21,
    maxEmployees: 50,
  },
};

export function getCheckoutProduct(key: string | undefined): CheckoutProduct | null {
  if (!key) return null;
  return CHECKOUT_PRODUCTS[key] ?? null;
}

export function isPlan(product: CheckoutProduct): boolean {
  return product.product !== "tag_a";
}

/** Total del checkout: tag-a es fijo; los planes cobran primer mes + N tags. */
export function checkoutTotal(product: CheckoutProduct, quantity: number): number {
  if (!isPlan(product)) return product.amount ?? 0;
  return (product.monthly ?? 0) + quantity * (product.tagPrice ?? 0);
}

/** Valida la cantidad de empleados para un plan (tag-a siempre es 1). */
export function validQuantity(product: CheckoutProduct, quantity: number): boolean {
  if (!isPlan(product)) return quantity === 1;
  return (
    Number.isInteger(quantity) &&
    quantity >= (product.minEmployees ?? 1) &&
    quantity <= (product.maxEmployees ?? 1)
  );
}
