import { Link } from 'react-router-dom';
import { Container } from '@/components/layout';
import { ROUTES } from '@/helpers/routes';

const sectionTitleClass =
  'mt-10 text-xl font-semibold text-[var(--color-neutral-darkest)] sm:text-2xl first:mt-0';
const subSectionTitleClass =
  'mt-6 text-lg font-semibold text-[var(--color-neutral-darkest)] sm:text-xl';
const paragraphClass = 'mt-3 text-base leading-relaxed text-[var(--color-text-secondary)]';
const listClass = 'mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-[var(--color-text-secondary)]';

const contactEmail = (
  <a
    href="mailto:burode452@gmail.com"
    className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]"
  >
    burode452@gmail.com
  </a>
);

const CookiesPolicyPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-[var(--color-soapstone-base)] pt-31 text-[var(--color-text-primary)] antialiased">
      <section className="px-4 pb-12 sm:pb-16 lg:pb-20" aria-label="Cookies Policy">
        <Container>
          <article className="mx-auto max-w-3xl rounded-2xl border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] px-6 py-10 sm:px-10 sm:py-12">
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              Останнє оновлення: 13.08.2026
            </p>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-neutral-darkest)] sm:text-4xl">
              Політика використання файлів Cookie
            </h1>

            <p className={paragraphClass}>
              Ця Політика використання файлів Cookie пояснює, як онлайн-платформа BÜRO.DE (далі -
              «Платформа») використовує файли cookie та подібні технології під час відвідування
              сайту.
            </p>
            <p className={paragraphClass}>
              Використовуючи сайт BÜRO.DE, користувач погоджується з використанням файлів cookie
              відповідно до цієї Політики.
            </p>

            <h2 className={sectionTitleClass}>1. Що таке файли Cookie</h2>
            <p className={paragraphClass}>
              Cookie - це невеликі текстові файли, які зберігаються на пристрої користувача
              (комп&apos;ютері, смартфоні або іншому пристрої) під час відвідування вебсайту.
            </p>
            <p className={paragraphClass}>Cookie допомагають сайту:</p>
            <ul className={listClass}>
              <li>правильно працювати;</li>
              <li>запам&apos;ятовувати налаштування користувача;</li>
              <li>забезпечувати безпечний вхід до акаунта;</li>
              <li>покращувати роботу платформи.</li>
            </ul>

            <h2 className={sectionTitleClass}>2. Які Cookie використовує BÜRO.DE</h2>
            <p className={paragraphClass}>
              На даний момент BÜRO.DE може використовувати такі категорії файлів cookie:
            </p>

            <h3 className={subSectionTitleClass}>2.1. Необхідні Cookie</h3>
            <p className={paragraphClass}>Ці файли необхідні для коректної роботи платформи.</p>
            <p className={paragraphClass}>Вони можуть використовуватися для:</p>
            <ul className={listClass}>
              <li>авторизації користувача;</li>
              <li>підтримки роботи особистого кабінету;</li>
              <li>забезпечення безпеки сайту;</li>
              <li>збереження технічних налаштувань.</li>
            </ul>
            <p className={paragraphClass}>
              Ці Cookie не можуть бути вимкнені, оскільки без них частина функцій платформи може
              працювати некоректно.
            </p>

            <h3 className={subSectionTitleClass}>2.2. Функціональні Cookie</h3>
            <p className={paragraphClass}>
              Ці Cookie допомагають запам&apos;ятовувати вибір користувача та покращувати
              взаємодію з платформою.
            </p>
            <p className={paragraphClass}>Наприклад:</p>
            <ul className={listClass}>
              <li>мова інтерфейсу;</li>
              <li>налаштування користувача;</li>
              <li>параметри відображення сторінок.</li>
            </ul>

            <h3 className={subSectionTitleClass}>2.3. Аналітичні Cookie</h3>
            <p className={paragraphClass}>
              У майбутньому BÜRO.DE може використовувати аналітичні інструменти, наприклад:
            </p>
            <ul className={listClass}>
              <li>Google Analytics;</li>
              <li>інші сервіси аналізу відвідуваності.</li>
            </ul>
            <p className={paragraphClass}>Такі Cookie можуть допомагати нам розуміти:</p>
            <ul className={listClass}>
              <li>кількість відвідувачів сайту;</li>
              <li>які сторінки переглядаються;</li>
              <li>як користувачі взаємодіють із платформою;</li>
              <li>як покращити навчальний сервіс.</li>
            </ul>
            <p className={paragraphClass}>
              Аналітичні Cookie можуть використовуватися лише після отримання відповідної згоди
              користувача, якщо це передбачено законодавством.
            </p>

            <h3 className={subSectionTitleClass}>2.4. Маркетингові Cookie</h3>
            <p className={paragraphClass}>
              У майбутньому BÜRO.DE може використовувати маркетингові інструменти, наприклад:
            </p>
            <ul className={listClass}>
              <li>Meta Pixel;</li>
              <li>рекламні сервіси;</li>
              <li>інші технології персоналізації реклами.</li>
            </ul>
            <p className={paragraphClass}>Такі Cookie можуть використовуватися для:</p>
            <ul className={listClass}>
              <li>показу більш релевантної реклами;</li>
              <li>аналізу ефективності рекламних кампаній;</li>
              <li>покращення комунікації з користувачами.</li>
            </ul>

            <h2 className={sectionTitleClass}>3. Cookie третіх сторін</h2>
            <p className={paragraphClass}>
              Деякі Cookie можуть встановлюватися сторонніми сервісами, які використовуються для
              роботи BÜRO.DE.
            </p>
            <p className={paragraphClass}>До таких сервісів можуть належати:</p>
            <ul className={listClass}>
              <li>платіжні сервіси;</li>
              <li>сервіси аналітики;</li>
              <li>сервіси електронної пошти;</li>
              <li>технічні постачальники.</li>
            </ul>
            <p className={paragraphClass}>
              Такі компанії обробляють інформацію відповідно до власних політик конфіденційності.
            </p>

            <h2 className={sectionTitleClass}>4. Платіжні сервіси</h2>
            <p className={paragraphClass}>
              Для здійснення оплат BÜRO.DE використовує платіжний сервіс:
            </p>
            <p className={paragraphClass}>
              <strong className="font-semibold text-[var(--color-text-primary)]">WayForPay</strong>
            </p>
            <p className={paragraphClass}>
              Під час здійснення платежу можуть використовуватися технічні файли cookie,
              необхідні для безпечного проведення транзакції.
            </p>
            <p className={paragraphClass}>
              BÜRO.DE не зберігає повні дані банківських карток користувачів.
            </p>

            <h2 className={sectionTitleClass}>5. Як керувати файлами Cookie</h2>
            <p className={paragraphClass}>Користувач може:</p>
            <ul className={listClass}>
              <li>
                дозволити або заборонити використання окремих категорій Cookie через банер
                налаштувань Cookie (якщо він використовується на сайті);
              </li>
              <li>змінити налаштування браузера;</li>
              <li>видалити збережені Cookie у будь-який момент.</li>
            </ul>
            <p className={paragraphClass}>
              Зверніть увагу: вимкнення необхідних Cookie може вплинути на роботу особистого
              кабінету та доступ до функцій платформи.
            </p>

            <h2 className={sectionTitleClass}>6. Згода на використання Cookie</h2>
            <p className={paragraphClass}>
              Під час першого відвідування сайту користувачу може бути запропоновано надати згоду
              на використання необов&apos;язкових Cookie.
            </p>
            <p className={paragraphClass}>Користувач може:</p>
            <ul className={listClass}>
              <li>погодитися з використанням усіх Cookie;</li>
              <li>відмовитися від необов&apos;язкових Cookie;</li>
              <li>налаштувати власні параметри.</li>
            </ul>

            <h2 className={sectionTitleClass}>7. Захист персональних даних</h2>
            <p className={paragraphClass}>
              Інформація, яка може збиратися через Cookie, обробляється відповідно до:
            </p>
            <p className={paragraphClass}>
              <Link
                to={ROUTES.PRIVACY}
                className="font-semibold text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]"
              >
                Політики конфіденційності BÜRO.DE
              </Link>
            </p>
            <p className={paragraphClass}>
              Ми застосовуємо необхідні заходи для захисту інформації користувачів.
            </p>

            <h2 className={sectionTitleClass}>8. Зміни до Cookie Policy</h2>
            <p className={paragraphClass}>
              BÜRO.DE може оновлювати цю Політику використання файлів Cookie у разі:
            </p>
            <ul className={listClass}>
              <li>зміни функціоналу сайту;</li>
              <li>підключення нових сервісів;</li>
              <li>зміни законодавчих вимог.</li>
            </ul>
            <p className={paragraphClass}>
              Актуальна версія завжди доступна на сайті BÜRO.DE.
            </p>

            <h2 className={sectionTitleClass}>9. Контактна інформація</h2>
            <p className={paragraphClass}>
              BÜRO.DE
              <br />
              ФОП Самойлова Анна
              <br />
              Адреса:
              <br />
              Україна, м. Київ, вул. Іоанна Павла II, 6/1
              <br />
              Email:
              <br />
              {contactEmail}
            </p>
          </article>
        </Container>
      </section>
    </div>
  );
};

export default CookiesPolicyPage;
