import { Product } from "@/app/types/productTypes";
import type { FilterValues } from "@/app/(public)/shop/ProductFilters";

export type DemoCategory = { id: string; slug: string; name: string; description: string; };

const electronics: DemoCategory = { id: "demo-cat-electronics", slug: "electronics", name: "Electronics", description: "Flagship smartphones, audio & smart wearables" };
const fashion: DemoCategory = { id: "demo-cat-fashion", slug: "indian-fashion", name: "Indian Fashion", description: "Royal Silk Kurtas, Handloom Sarees & festive wear" };
const footwear: DemoCategory = { id: "demo-cat-footwear", slug: "footwear", name: "Footwear", description: "Formal leather shoes, sneakers & sports runners" };
const homeKitchen: DemoCategory = { id: "demo-cat-home", slug: "home-kitchen", name: "Home & Kitchen", description: "Smart induction cooktops & modern appliances" };

export const DEMO_CATEGORIES: DemoCategory[] = [electronics, fashion, footwear, homeKitchen];

function variant(id: string, sku: string, price: number, stock = 24, images: string[] = []): Product["variants"][0] {
  return { id, sku, price, images, stock, lowStockThreshold: 5, barcode: null, warehouseLocation: null, attributes: [] };
}

function product(p: Omit<Product, "reviews"> & { reviews?: Product["reviews"] }): Product {
  return { reviews: [], description: p.description ?? null, ...p };
}

// 100% Real, Verified High-Quality Indian Product Photography
export const DEMO_PRODUCTS: Product[] = [
  product({
    id: "demo-prod-1",
    slug: "samsung-galaxy-s24",
    name: "Samsung Galaxy S24 Ultra",
    isNew: true,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    averageRating: 4.8,
    reviewCount: 2340,
    description: "Samsung flagship featuring Titanium frame, 200MP Quad Telephoto camera with Galaxy AI, and Snapdragon 8 Gen 3.",
    variants: [variant("demo-var-1", "SAM-S24-001", 74999, 18, [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
    ])],
    category: electronics,
  }),
  product({
    id: "demo-prod-2",
    slug: "boat-airdopes-141",
    name: "boAt Airdopes 141 True Wireless Earbuds",
    isNew: false,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    averageRating: 4.4,
    reviewCount: 18920,
    description: "India's bestselling TWS earbuds. 42H playback, BEAST mode for gaming, ENx noise cancellation, and IPX4 water resistance.",
    variants: [variant("demo-var-2", "BOAT-141-001", 1299, 200, [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
    ])],
    category: electronics,
  }),
  product({
    id: "demo-prod-3",
    slug: "noise-colorfit-pro-4",
    name: "Noise ColorFit Pro 4 Smartwatch",
    isNew: false,
    isFeatured: true,
    isTrending: true,
    isBestSeller: false,
    averageRating: 4.4,
    reviewCount: 8750,
    description: "1.72\" TruView display, Bluetooth calling, 100 sports modes, 24/7 heart rate & SpO2 monitor with 7-day battery life.",
    variants: [variant("demo-var-3", "NOISE-PRO4-001", 3499, 45, [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    ])],
    category: electronics,
  }),
  product({
    id: "demo-prod-4",
    slug: "manyavar-silk-kurta",
    name: "Manyavar Royal Silk Kurta & Pyjama Set",
    isNew: true,
    isFeatured: true,
    isTrending: true,
    isBestSeller: false,
    averageRating: 4.7,
    reviewCount: 1240,
    description: "Pure art silk kurta set crafted with intricate embroidery and royal mandarin collar. Designed for weddings and festive occasions.",
    variants: [variant("demo-var-4", "MAN-KUR-001", 5999, 30, [
      "https://images.unsplash.com/photo-1626863905121-3b0c0ed7b94c?w=600&q=80",
    ])],
    category: fashion,
  }),
  product({
    id: "demo-prod-5",
    slug: "fabindia-cotton-saree",
    name: "Fabindia Handloom Pure Cotton Saree",
    isNew: false,
    isFeatured: true,
    isTrending: false,
    isBestSeller: true,
    averageRating: 4.9,
    reviewCount: 3200,
    description: "Handwoven pure cotton saree with authentic Indian floral and zari border accents. Lightweight and breathable for all day elegance.",
    variants: [variant("demo-var-5", "FAB-SAR-001", 2499, 50, [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
    ])],
    category: fashion,
  }),
  product({
    id: "demo-prod-6",
    slug: "bata-men-formal-shoes",
    name: "Bata Premium Derby Leather Formal Shoes",
    isNew: false,
    isFeatured: false,
    isTrending: false,
    isBestSeller: true,
    averageRating: 4.5,
    reviewCount: 5620,
    description: "Handcrafted genuine leather Derby formal shoes with cushioned memory foam insole and slip-resistant TPR sole.",
    variants: [variant("demo-var-6", "BATA-FM-001", 2199, 40, [
      "https://images.unsplash.com/photo-1563434564528-8fdf5996e622?w=600&q=80",
    ])],
    category: footwear,
  }),
  product({
    id: "demo-prod-7",
    slug: "prestige-induction-cooktop",
    name: "Prestige Smart Induction Cooktop 2000W",
    isNew: false,
    isFeatured: false,
    isTrending: true,
    isBestSeller: true,
    averageRating: 4.6,
    reviewCount: 9870,
    description: "Smart 2000W induction cooktop with pre-programmed Indian cooking menus (Chapati, Dosa, Curry, Idli), dual heat sensor & child lock.",
    variants: [variant("demo-var-7", "PRES-IND-001", 2799, 60, [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80",
    ])],
    category: homeKitchen,
  }),
  product({
    id: "demo-prod-8",
    slug: "redmi-note-13-pro",
    name: "Redmi Note 13 Pro 5G",
    isNew: true,
    isFeatured: true,
    isTrending: true,
    isBestSeller: false,
    averageRating: 4.6,
    reviewCount: 14230,
    description: "200MP OIS camera, 1.5K 120Hz curved AMOLED display, Snapdragon 7s Gen 2 processor, and 67W Turbo Charge.",
    variants: [variant("demo-var-8", "RED-N13P-001", 26999, 35, [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80",
    ])],
    category: electronics,
  }),
  product({
    id: "demo-prod-9",
    slug: "campus-running-shoes",
    name: "Campus Men's Air-Cushion Running Shoes",
    isNew: false,
    isFeatured: false,
    isTrending: true,
    isBestSeller: true,
    averageRating: 4.3,
    reviewCount: 7650,
    description: "Breathable engineered mesh running shoes with responsive air-capsule sole technology for athletic workouts and running.",
    variants: [variant("demo-var-9", "CAM-RUN-001", 1299, 80, [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    ])],
    category: footwear,
  }),
];

export function getDemoProductBySlug(slug: string): Product | undefined {
  return DEMO_PRODUCTS.find((p) => p.slug === slug);
}

export function filterDemoProducts(products: Product[], filters: FilterValues): Product[] {
  return products.filter((product) => {
    if (filters.search) { const q = filters.search.toLowerCase(); if (!product.name.toLowerCase().includes(q)) return false; }
    if (filters.categoryId && product.category?.id !== filters.categoryId) return false;
    if (filters.isNew && !product.isNew) return false;
    if (filters.isFeatured && !product.isFeatured) return false;
    if (filters.isTrending && !product.isTrending) return false;
    if (filters.isBestSeller && !product.isBestSeller) return false;
    const price = product.variants[0]?.price ?? 0;
    if (filters.minPrice !== undefined && price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
    return true;
  });
}

export function paginateDemoProducts(products: Product[], skip: number, first: number): { products: Product[]; hasMore: boolean; totalCount: number } {
  const slice = products.slice(skip, skip + first);
  return { products: slice, hasMore: skip + first < products.length, totalCount: products.length };
}
