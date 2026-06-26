export interface BikeColor {
  name: string;
  value: string; // hex colour or Tailwind colour name
  imageUrl: string;
}

export interface BikeProduct {
  id: string;
  name: string;
  tagphrase?: string;
  description: string;
  basePrice: number;
  ageYears: string;
  colors: BikeColor[];
  defaultColorIndex: number;
  images?: string[];
}

export interface CartItem {
  id: string; // bikeProductId + colorName
  product: BikeProduct;
  selectedColor: BikeColor;
  quantity: number;
  price: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  imageUrl: string;
  date: string;
  readTime: string;
  author: string;
}

export interface FeatureSetting {
  title: string;
  desc: string;
  iconName: string;
}

export interface UISettings {
  announcementText: string;
  announcementMoving: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroHighlightText: string;
  heroImages: string[];
  whyBalanzaTitle: string;
  whyBalanzaVideoUrl: string;
  features: FeatureSetting[];
  instagramTitle: string;
}

