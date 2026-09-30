export type ServiceCategory = "quick_creative" | "social_content" | "brand_starter" | "business_launch" | "website" | "document" | "custom";

export interface RevenueRequest {
  request: string;
  category?: ServiceCategory;
  complexity?: "simple" | "standard" | "complex";
  rush?: boolean;
  revisionRounds?: number;
}

export interface QuoteRecommendation {
  category: ServiceCategory;
  quoteUsd: number;
  closeRangeUsd: [number, number];
  floorUsd: number;
  depositUsd: number;
  revisionRounds: number;
  turnaround: string;
  assumptions: string[];
  upsells: { label: string; priceUsd: number }[];
}

const BASE: Record<ServiceCategory, { quote: number; floor: number; turnaround: string }> = {
  quick_creative: { quote: 125, floor: 75, turnaround: "same day when capacity allows" },
  social_content: { quote: 225, floor: 150, turnaround: "1-2 business days" },
  brand_starter: { quote: 350, floor: 250, turnaround: "2-3 business days" },
  business_launch: { quote: 650, floor: 450, turnaround: "3-5 business days" },
  website: { quote: 750, floor: 500, turnaround: "3-5 business days" },
  document: { quote: 250, floor: 150, turnaround: "1-3 business days" },
  custom: { quote: 500, floor: 300, turnaround: "scoped after intake" },
};

export function inferServiceCategory(request: string): ServiceCategory {
  const q = request.toLowerCase();
  if (/website|landing page|site/.test(q)) return "website";
  if (/launch.*business|business.*launch|startup package/.test(q)) return "business_launch";
  if (/brand|logo|identity|brand kit/.test(q)) return "brand_starter";
  if (/reel|social|instagram|content pack|caption/.test(q)) return "social_content";
  if (/flyer|poster|graphic|menu|price sheet|business card/.test(q)) return "quick_creative";
  if (/pdf|proposal|presentation|document|resume/.test(q)) return "document";
  return "custom";
}

export function recommendQuote(input: RevenueRequest): QuoteRecommendation {
  const category = input.category ?? inferServiceCategory(input.request);
  const base = BASE[category];
  const complexityMultiplier = input.complexity === "complex" ? 1.5 : input.complexity === "simple" ? 0.85 : 1;
  const rushMultiplier = input.rush ? 1.25 : 1;
  const quote = Math.ceil((base.quote * complexityMultiplier * rushMultiplier) / 25) * 25;
  const floor = Math.ceil((base.floor * complexityMultiplier) / 25) * 25;
  const revisions = Math.max(1, Math.min(input.revisionRounds ?? 2, 3));
  return {
    category,
    quoteUsd: quote,
    closeRangeUsd: [Math.max(floor, Math.round(quote * 0.85 / 25) * 25), quote],
    floorUsd: floor,
    depositUsd: Math.ceil((quote * 0.5) / 25) * 25,
    revisionRounds: revisions,
    turnaround: input.rush ? "rush delivery, subject to capacity" : base.turnaround,
    assumptions: [
      "Pricing is a starting recommendation, not a market guarantee.",
      "Scope beyond the agreed deliverables is quoted separately.",
      "External paid services, printing, hosting, domains, ad spend, and licensed assets are excluded unless explicitly approved.",
      "Final delivery follows Founder approval and cleared payment terms."
    ],
    upsells: category === "website"
      ? [{ label: "Launch social creative pack", priceUsd: 175 }, { label: "Customer-acquisition starter kit", priceUsd: 225 }]
      : category === "quick_creative"
        ? [{ label: "3-piece matching social pack", priceUsd: 125 }]
        : [{ label: "Fast-turnaround add-on", priceUsd: 75 }],
  };
}
