
import { SkinProfile, Product } from "@/models/product";

export interface ProductContextType {
  products: Product[];
  recentlyScanned: Product[];
  favorites: Product[];
  skinProfile: SkinProfile | null;
  currentProduct: Product | null;
  setCurrentProduct: (product: Product | null) => void;
  addProduct: (product: Product) => void;
  toggleFavorite: (productId: string) => void;
  setSkinProfile: (profile: SkinProfile) => void;
  isLoading: boolean;
}
