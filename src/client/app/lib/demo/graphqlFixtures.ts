export const DEMO_ANALYTICS_OVERVIEW = {
  revenueAnalytics: {
    totalRevenue: 1845290,
    changes: { revenue: 14.8 },
    monthlyTrends: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      revenue: [185000, 224000, 290000, 345000, 389000, 412290],
    },
  },
  orderAnalytics: {
    totalOrders: 642,
    totalSales: 685,
    changes: { sales: 12.4, orders: 9.8 },
  },
  userAnalytics: {
    totalUsers: 2480,
    changes: { users: 18.2 },
  },
  yearRange: { minYear: 2023, maxYear: 2026 },
  interactionAnalytics: {
    totalInteractions: 18450,
    byType: { views: 12400, clicks: 4600, others: 1450 },
  },
  productPerformance: [
    { id: "demo-prod-1", name: "Samsung Galaxy S24 Ultra", quantity: 48, revenue: 3599952 },
    { id: "demo-prod-8", name: "Redmi Note 13 Pro 5G", quantity: 64, revenue: 1727936 },
    { id: "demo-prod-4", name: "Manyavar Silk Kurta Set", quantity: 112, revenue: 559888 },
    { id: "demo-prod-3", name: "Noise ColorFit Pro 4", quantity: 135, revenue: 472365 },
    { id: "demo-prod-2", name: "boAt Airdopes 141", quantity: 240, revenue: 311760 },
    { id: "demo-prod-5", name: "Fabindia Pure Cotton Saree", quantity: 76, revenue: 295640 },
    { id: "demo-prod-7", name: "Prestige Induction Cooktop", quantity: 58, revenue: 162342 },
    { id: "demo-prod-9", name: "Campus Running Shoes", quantity: 95, revenue: 123405 },
    { id: "demo-prod-6", name: "Bata Derby Formal Shoes", quantity: 42, revenue: 104958 },
  ],
};

export const DEMO_ALL_ANALYTICS = {
  ...DEMO_ANALYTICS_OVERVIEW,
  revenueAnalytics: {
    ...DEMO_ANALYTICS_OVERVIEW.revenueAnalytics,
    monthlyTrends: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      revenue: [185000, 224000, 290000, 345000, 389000, 412290],
      orders: [68, 82, 95, 115, 134, 148],
      sales: [72, 88, 102, 124, 142, 157],
      users: [210, 265, 340, 420, 560, 685],
    },
  },
  orderAnalytics: {
    totalOrders: 642,
    totalSales: 685,
    averageOrderValue: 2874,
    changes: { orders: 9.8, sales: 12.4, averageOrderValue: 5.6 },
  },
  userAnalytics: {
    totalUsers: 2480,
    totalRevenue: 1845290,
    retentionRate: 0.68,
    lifetimeValue: 4650,
    repeatPurchaseRate: 0.44,
    engagementScore: 89,
    changes: { users: 18.2 },
    topUsers: [
      {
        id: "demo-user-1",
        name: "Keethan Customer",
        email: "customer@keethankart.com",
        orderCount: 8,
        totalSpent: 82450,
        engagementScore: 94,
      },
    ],
    interactionTrends: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      views: [2100, 2450, 2300, 2800, 3100, 3900, 2800],
      clicks: [580, 690, 640, 780, 890, 1120, 810],
      others: [120, 160, 140, 185, 220, 290, 195],
    },
  },
  interactionAnalytics: {
    ...DEMO_ANALYTICS_OVERVIEW.interactionAnalytics,
    mostViewedProducts: [
      { productId: "demo-prod-1", productName: "Samsung Galaxy S24 Ultra", viewCount: 4820 },
      { productId: "demo-prod-8", productName: "Redmi Note 13 Pro 5G", viewCount: 3940 },
    ],
  },
};

export const DEMO_SEARCH_RESULTS = [
  {
    type: "product",
    id: "demo-prod-1",
    title: "Samsung Galaxy S24 Ultra",
    description: "Flagship 50MP camera smartphone — ₹74,999",
  },
  {
    type: "order",
    id: "demo-order-1",
    title: "Order demo-order-1",
    description: "Delivered — ₹74,999",
  },
  {
    type: "user",
    id: "demo-user-2",
    title: "Keethan R (Admin)",
    description: "admin@keethankart.com",
  },
];
