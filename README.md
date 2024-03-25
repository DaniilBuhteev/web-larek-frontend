# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные

```
Возмодные категории товара:
export type TCategory = 'soft-skill' | 'hard-skill' | 'additional' | 'button' | 'other';
Возможные варианты оплаты:
export type TPayment = 'online' | 'offline';
Типизация ошибки формы:
export type FormErrors = Partial < Record < keyof IOrder, string >> ;
Интерфейс данных карточки:
export interface IProduct {
	id: string;
	title: string;
	description: string;
	price: number | null;
	category: TCategory;
	image: string;
	index: number;
}
Интерфейс формы оплаты:
export interface IPaymentForm {
	payment: string;
	address: string;
}
Интерфейс формы контактов:
export interface IContactsForm {
	email: string;
	phone: string;
}
Интерфейс главной страницы:
export interface IPage {
	products: IProduct[];
	counter: number;
}
Интерфейс корзины покупок:
export interface IBasket {
	products: IProduct[];
	priceAll: number;
	add(): void;
	remove(): void;
}
Данные для успешного оформления заказа:
export interface IOrder extends IPaymentForm, IContactsForm {
	total: number;
	items: string[];
}
Используется для типизации ответа сервера в случае успешного оформления заказа.
export interface ISuccess {
	total: number;
	id: string;
}
Интерфейс модальных окон:
export interface IModalData {
	content: HTMLElement;
}
Интерфейс для класса формы:
export interface IFormState {
	valid: boolean;
	errors: string[];
}
Интерфейс для события:
export interface IActions {
	onClick: () => void;
}
```

## Базовый код
1) Класс EventEmitter - отвечает за возможность устанавливать и снимать события.
Поля: \
  _events\
Методы:\
    on<T extends object>(eventName: EventName, callback: (event: T) => void) - Установить обработчик на событие\
    off(eventName: EventName, callback: Subscriber) - Снять обработчик с события\
    emit<T extends object>(eventName: string, data?: T) - Инициировать событие с данными\
    onAll(callback: (event: EmitterEvent) => void) - Слушать все события\
    offAll() - Сбросить все обработчики\
    trigger<T extends object>(eventName: string, context?: Partial<T>) - Сделать коллбек триггер, генерирующий событие при вызове

2) класс Api - отправляет запросы на сервер
Поля:\
    readonly baseUrl\
    protected options\

Методы: \
    protected handleResponse(response: Response): Promise<object> - обработать ответ сервера\
    get(uri: string) - GET - запрос\
    post(uri: string, data: object, method: ApiPostMethods = 'POST') - POST - запрос

3) Component<T> - абстрактный базовый класс, предоставляет инструментарий для работы с DOM в дочерних компонентах. 

Методы:\
    toggleClass(element: HTMLElement, className: string, force?: boolean) - Переключить класс\
    protected setText(element: HTMLElement, value: unknown) - Установить текстовое содержимое\
    setDisabled(element: HTMLElement, state: boolean) - Сменить статус блокировки\
    protected setHidden(element: HTMLElement) - Скрыть\
    protected setVisible(element: HTMLElement) - Показать\
    protected setImage(element: HTMLImageElement, src: string, alt?: string) - Установить изображение с алтернативным текстом\
    render(data?: Partial<T>): HTMLElement - Вернуть корневой DOM-элемент

4) Model<T> - абстрактный базовый класс, для управления данными и их взаимодействия с системой событий.
Методы:\
    emitChanges(event: string, payload?: object) - Сообщить всем что модель поменялась

## Модели данных

1) класс LarekApi extends Api - сервисный, нужен для получения данных с сервера наследуется от базового класса Api

Методы:\
getProducts - получает товары с сервера\
orderProducts - отправляет данные успешного заказа   

2) Класс AppState extends Model<T> - класс хранит текущее состояние приложения
Поля:\
  catalog: ProductItem[]\
	order: IOrder \
	basket: IProduct[]\
	formErrors: FormErrors\
	preview: string | null\
  products: IProduct[] - массив товаров\

Методы:\
  setCatalog(items: IProduct[]) - устанавливает товары в каталог\
	setPreview(item: ProductItem) - устанавливает превью товара\
	setTotal(value: number) - установить полную стоимость всех товаров в поле заказа\
	getTotal()  - получить полную стоимость всех товаров в заказе\
	addProductBasket(item: IProduct) - добавить продукт в корзину\
	removeProductBasket(item: IProduct) - удалить продукт из корзины\
	clearBasket() - очистить корзину\
	setOrderField(field: keyof IContactsForm, value: string) - заполнить поля заказа\
	validateOrder() - валидация полей заказа\
  clearOrderField() - очистка полей заказа

## Компоненты представления
1) класс Product extends Component<IProduct> - класс наслtдуется от базового класса Component<T> и расширяется интерфейсом IProduct, служит для создания карточки продукта
Поля:\
  protected _id: string;\
	protected _title\
	protected _description\
	protected _price\
	protected _category\
	protected _image \
	protected _button \
	protected _categoryColors \

Методы:\
	set title(value: string) - установить название\
	set image(value: string) - установить картинку\
	set price(value: number) - установить цену\
	set category(value: string) - установить категорию

2) export class ProductPreview extends Product - класс наследутся от класса Product, служит для отображения превью продукта
Поля:\
  protected _description\
	buttonElement\

Методы:\
set description(value: string) - установить описание товара

3) export class BasketItem extends Product - класс наследуется от класса Product, служит для отображение продукта в корзине
Поля:\
  buttonElement\
	protected _index\

Методы:
	set index(value: number) - устанавливает индекс продукта

4) класс Basket extends Component<IBasket> - класс наследуется от базового класса Component<T> и расширяется интерфейсом IBasket, служит для отображения корзины
Поля:\
	protected _list\
	protected _total\
	protected button

Методы:\
	set items(items: HTMLElement[]) - устанавливает товары\
	set total(total: number) - устанавливает полную стоимость в корзине

5) класс Page extends Component<IPage> - класс наследуется от базового класса Component<T> и расширяется интерфейсом IPage, служит для отображения главной страницы
Поля:
  protected _catalog\
	protected _counter\
	protected _wrapper\
	protected _basket

Методы:\
	set counter(value: number) - установить счетчик на главной странице\
	set catalog(items: HTMLElement[]) - установить товары на странице\
	set locked(value: boolean) - 'заблочить' страницу при открытии модальных окон

6) класс export class Modal <T> extends Component <IModalData> - класс наследуется от базового класса Component<T> и расширяется интерфейсом IModalData, служит управления и отображения модальных окон
Поля: 
  protected _closeButton\
	protected _content 

Методы:\
  set content(value: HTMLElement) - устанавливает данные в модальное окно\
	open() - открыть модальное окно\
	close() - закрыть модальное окно\
	render(data: IModalData): HTMLElement - возвращает разметку модального окна

7) класс export class Form <T> extends Component <IFormState> - класс наследуется от базового класса Component<T> и расширяется интерфейсом IFormState, служит для управления отображения формами 
Поля:\
  protected _submit\
	protected _errors\

Методы:\
  set valid(value: boolean) - блокирует кнопку если поле не валидно\
	set errors(value: string) - устанавливает ошибку невалидности\
	render(state: Partial < T > & IFormState) - устанавливает данные в модальное окно

8) класс export class ContactsForm extends Form <IContactsForm> - класс наследуется от класса Formt<T> и расширяется интерфейсом IContactsForm, служит для отображения 

Методы:\
 	set phone(value: string) - устанавливает телефон покупателя\
	set email(value: string) - устанавливает почту покупателя

9) класс export class PaymentForm extends Form <IPaymentForm> - класс наследуется от базового класса Form<T> и расширяется интерфейсом IPaymentForm, служит для отображения формы оплаты

Методы:\
  set payment(value: string) - устанавливает способ оплаты\
	set address(value: string) - устанавливает адрес покупателя

10) класс export class Success extends Component <ISuccess> - класс наследуется от базового класса Component<T> и расширяется интерфейсом ISuccess, служит для отображения окна успешной покупки
Поля:\
  protected _close\
	protected _total\
Методы:  \
  set total(total: number | string) - установить итоговое кол-во списанных синапсов

## Presenter

Список событий:  
1) catalog:painted - каталог товаров отрисован на главной странице
2) product:select - продукт выбран
3) basket:add - добавлен продукт в корзину
4) basket:change - корзина изменилась
5) basket:remove - удален товар из корзины
6) basket:open - корзина открыта
7) order:submit - отправлен заказ
8) payment:open - открыта форма оплаты
9) contacts:submit - отправлена форма контактов
10) modal:open - открыто модальное окно
11) modal:close -  закрыто модальное окно
12) payment:change - изменился тип оплаты
13) /(^order|^contacts)\..*:change/ - изменилось одно из полей данных пользователя
14) formErrors:change - изменилась валидация полей покупателя
15) order:filled - поля заполнены