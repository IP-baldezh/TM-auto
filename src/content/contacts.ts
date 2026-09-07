/**
 * Телефоны и почты компании.
 *
 * Заданы здесь, а не в базе, по двум причинам: модель ContactChannel
 * описывает мессенджеры как общие для сайта, а их нужно привязывать к
 * конкретному номеру, и поле email в SiteSettings всего одно.
 *
 * Этот модуль — единственный источник: его читают и блок «Контакты»,
 * и подвал, иначе они разойдутся между собой.
 */

export type MessengerKind = 'telegram' | 'whatsapp' | 'max';

export const PHONES: {
  label: string;
  phone: string;
  messengers: MessengerKind[];
}[] = [
  {
    label: 'Авто под заказ и подбор',
    phone: '+7 (908) 235-08-45',
    messengers: ['telegram', 'whatsapp'],
  },
  {
    label: 'Авто под заказ и подбор',
    phone: '+7 (920) 021-18-52',
    messengers: ['telegram', 'max'],
  },
];

export const EMAILS = ['moskalev_tmn@mail.ru', 'mike_badgo@mail.ru'];

/**
 * Группа во ВКонтакте.
 *
 * Поле vkUrl есть и в схеме, и в админке, но в базе на сервере лежит
 * null — сид отработал раньше. Значение отсюда используется как
 * запасное, поэтому ссылка появится сразу, а заданная через админку
 * по-прежнему будет перекрывать её.
 */
export const VK_URL = 'https://vk.ru/tm_autodzr';

export const TG_CHANNEL_URL = 'https://t.me/tm_autoclub';

export const MAX_URL = 'https://max.ru/u/f9LHodD0cOLDDzuKzqkNk4Mrlus7_JteqNT_8YAPjgfWCu7R_g-rN6dY2zc';
