import './scss/styles.scss';

export type TCategory = 'soft-skill' | 'hard-skill' | 'additional' | 'button' | 'other';
export type TPayment = 'online' | 'offline';

export interface IProduct {
  id: number;
  title: string; 
  description : string; 
  price: number | null; 
  category: TCategory;
  image: string; 
}

export interface IPaymentForm {
  payment: TPayment; 
  address: string;
}

export interface IContactsForm { 
  email: string;
  phone: string;
}

export interface IPage {
  products: IProduct[];
  counter: number;
}

export interface IBasket { 
  products: IProduct[];
  priceAll: number;
  add(): void;
  remove(): void;
}

export interface IOrder extends IPaymentForm, IContactsForm {
  total: number;
  items: string[];
}

export interface ISuccess {
  total:number; 
  id:string[];
}