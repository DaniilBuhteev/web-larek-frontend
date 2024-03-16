import './scss/styles.scss';

export type TCategory = 'софт-скилл' | 'хард-скилл' | 'дополнительное' | 'кнопка' | 'другое';
export type TSposob = 'онлайн' | 'офлайн';

interface ITovar {
  id: number;
  name: string; 
  description : string; 
  price: number; 
  category: TCategory;
  img: string; 
}

interface IBuyForm {
  sposob: TSposob; 
  addres: string;
}

interface IContacts { 
  email: string;
  phone: string;
}

interface IPage {
  tovars: ITovar[];
  counter: number;
}

interface IBasket { 
  tovars: ITovar[];
  priceAll: number;
  add(): void;
  remove(): void;
}

interface IAppState {
	tovars: ITovar[];
	basket: ITovar[];
}
