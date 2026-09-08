export { PRODUCTS_PAGE_SIZE } from './config/pagination';
export { formatPrice, getDiscountPercent } from './lib/formatPrice';
export { buildProductImage, buildProductPhoto } from './lib/productImage';
export type {
  PriceRange,
  Product,
  ProductFilters,
  ProductPage,
  ProductSort,
} from './model/types';
export { useInfiniteProducts } from './model/useInfiniteProducts';
export { usePriceRange } from './model/usePriceRange';
export { useProduct } from './model/useProduct';
export { useProducts, type UseProductsOptions } from './model/useProducts';
export { ProductCard, type ProductCardProps } from './ui/ProductCard';
