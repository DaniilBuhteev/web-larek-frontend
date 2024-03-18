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
Возможные категории товара:
export type TCategory = 'софт-скилл' | 'хард-скилл' | 'дополнительное' | 'кнопка' | 'другое';

Возможные варианты оплаты товара:
export type TPayment = 'online' | 'offline';

Данные карточек товара:
export interface IProduct {
  id: number;
  title: string; 
  description : string; 
  price: number | null; 
  category: TCategory;
  image: string; 
}

Данные формы оплаты:
export interface IPaymentForm {
  payment: TPayment; 
  addres: string;
}

Данные формы контактов:
export interface IContacts { 
  email: string;
  phone: string;
}

Данные формы страницы:
export interface IPage {
  products: IProduct[];
  counter: number;
}

Данные корзины:
export interface IBasket { 
  products: IProduct[];
  priceAll: number;
}

Данные для успешного оформления товара:
export interface iSuccess extends IPaymentForm, IContacts {
  total: number;
  items: string[];
}
```

## Базовый код
1) Класс EventEmitter - отвечает за возможность устанавливать и снимать события.

Методы: 
on - вешает событие
off - снимает событие
emit - запускает событие
trigger - создает колбэк, генерирующий событие
onAll - вешает все события на элемент

Класс Component 

2) класс Api - отправляет запросы на сервер

Методы: 
handleRespons - обрабатывает ответ сервера
get - GET-запрос
post -POST-запрос

3) Component<T> - абстрактный базовый класс, предоставляет инструментарий для работы с DOM в дочерних компонентах. 

Методы:
toggleClass - переключает класс.
setText - установливает текстовое содержимое.
setDisabled - сменяет статус блокировки.
setHidden - скрывает элемент.
setVisible - показывает элемент.
setImage - установливает изображение с алтернативным текстом.
render - возвращает корневой DOM-элемент.

4) Model<T> - абстрактный базовый класс, для управления данными и их взаимодействия с системой событий.

Методы:
emitChanges - cообщает всем что модель поменялась.

## Модели данных

1) класс LarekApi extends Api - класс для получения данных с сервера наследуется от базового класса Api

Методы:
getProducts - получает товары с сервера
pushSuccessOrder - отправляет данные успешного заказа

2) Класс AppState extends Model<T> - класс хранит текущее состояние приложения
Поля:
products: IProduct[] - массив товаров

Методы:
addBasket - добавляет товар в корзину
removeBasket - удаляет товар из корзины
clearBasket - очищает корзину


## Компоненты представления
1) класс Product extends Component<IProduct> - класс наслtдуется от базового класса Component<T> и расширяется интерфейсом IProduct, служит для создания карточки продукта

Методы:
set id - устанавливает id товара
set title - устанавливает title продукта
set image - устанавливает image продукта
set category - устанавливает category товара
set price - устанавливает price товара

2) класс Page extends Component<IPage> - класс наследуется от базового класса Component<T> и расширяется интерфейсом IPage, служит для отображения главной страницы

Методы:
set products - устанавливает каталог продуктов
set counter - устанавливает кол-во товаров в корзине

3) класс Basket extends Component<IBasket> - класс наследуется от базового класса Component<T> и расширяется интерфейсом IBasket, служит для отображения корзины

Методы:
set priceAll - устанавливает итоговую цену
set products - устанавливает товары добавленные в корзину

4) класс Contacts extends Component<IContacts> - класс наследуется от базового класса Component<T> и расширяется интерфейсом IContacts, служит для отображения формы контактов

Методы:
set email - устанавливает почту покупателя
set phone - устанавливает телефон покупателя

5) класс PaymentForm extends Component<IPaymentForm> - класс наследуется от базового класса Component<T> и расширяется интерфейсом IPaymentForm, служит для отображения формы заказа

Методы:
selectPayment - выбирает способ оплаты
set addres - устанавливает адрес

## Presenter

Список событий:

1) product:select - выбрана карточка товара
2) product:add - товар добавлен в корзину
3) product:remove - товар удален из корзины
4) modal:open - модальное окно открыто
5) modal:close - модальное окно закрыто
