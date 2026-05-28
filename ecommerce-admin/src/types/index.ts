export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactMessage extends ContactFormData {
  _id: string;
  createdAt: string;
}

export interface Admin {
  _id: string;
  email: string;
}