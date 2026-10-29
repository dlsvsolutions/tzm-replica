export type RecommendationAlgorithm = 
  | 'vector_similarity' 
  | 'collaborative_filtering' 
  | 'co_occurrence' 
  | 'cold_start';

export interface RecommendationMetadata {
  algorithm: RecommendationAlgorithm;
  confidence_score: number; // Rango 0.0 a 1.0
  reason: string; // Explicabilidad: "Comprado comúnmente con Harina PAN"
  source_vector_distance?: number;
}

export interface RecommendedProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  image_url: string;
  stock: number;
  metadata: RecommendationMetadata;
}

export interface IRecommendationService {
  getPersonalizedHomeFeed(userId: string, limit?: number): Promise<RecommendedProduct[]>;
  getFrequentlyBoughtTogether(productId: string): Promise<RecommendedProduct[]>;
  getSimilarAlternatives(productId: string, limit?: number): Promise<RecommendedProduct[]>;
  getCartComplements(cartProductIds: string[]): Promise<RecommendedProduct[]>;
}
