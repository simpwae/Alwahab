export const manifest = {
  screens: {
    scr_ktnguf: { name: "Home", route: "/", position: { "x": 160, "y": 1820 } },
    scr_wzsjxn: { name: "Style Guide", route: "/style-guide", position: { "x": 1400, "y": 0 }, isDefaultRow: true },
    scr_j0bnpo: { name: "Category Listing", route: "/category/electronics", position: { "x": 1560, "y": 1820 } },
    scr_8jpkvw: { name: "Deals", route: "/deals", position: { "x": 160, "y": 3800 } },
    scr_cfxqkp: { name: "Search Results", route: "/search?q=headphones", position: { "x": 2960, "y": 1820 } },
    scr_9c4v6s: { name: "Product Detail", route: "/product/p1", position: { "x": 4360, "y": 1820 } },
    scr_uqupxr: { name: "Cart", route: "/cart", position: { "x": 160, "y": 5780 } },
    scr_wtpf76: { name: "Checkout", route: "/checkout", position: { "x": 1560, "y": 5780 } },
    scr_6s5prb: { name: "Order Confirmation", route: "/order-confirmation/ALW-10234", position: { "x": 2960, "y": 5780 } },
    scr_llz7no: { name: "Track Order", route: "/track-order", position: { "x": 4360, "y": 5780 } }
  },
  sections: {
    sec_2f81u8: { name: "Browse & Purchase", x: 0, y: 1600, width: 5720, height: 1180 },
    sec_27juax: { name: "Promotions", x: 0, y: 3580, width: 1520, height: 1180 },
    sec_qewug0: { name: "Checkout & Fulfillment", x: 0, y: 5560, width: 5720, height: 1180 }
  },
  layers: [
  { kind: "screen", id: "scr_wzsjxn" },
  { kind: "section", id: "sec_2f81u8", children: [
    { kind: "screen", id: "scr_ktnguf" },
    { kind: "screen", id: "scr_j0bnpo" },
    { kind: "screen", id: "scr_cfxqkp" },
    { kind: "screen", id: "scr_9c4v6s" }]
  },
  { kind: "section", id: "sec_27juax", children: [
    { kind: "screen", id: "scr_8jpkvw" }]
  },
  { kind: "section", id: "sec_qewug0", children: [
    { kind: "screen", id: "scr_uqupxr" },
    { kind: "screen", id: "scr_wtpf76" },
    { kind: "screen", id: "scr_6s5prb" },
    { kind: "screen", id: "scr_llz7no" }]
  }]

};