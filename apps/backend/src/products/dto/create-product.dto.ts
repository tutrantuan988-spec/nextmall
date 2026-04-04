export class CreateProductDto {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sold?: number;
  category: string;
  imageUrl: string;
  brand: string;
}
