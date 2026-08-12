import { Container } from '@/components/layout';

const sectionTitleClass =
  'mt-10 text-xl font-semibold text-[var(--color-neutral-darkest)] sm:text-2xl first:mt-0';
const paragraphClass = 'mt-3 text-base leading-relaxed text-[var(--color-text-secondary)]';
const listClass = 'mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-[var(--color-text-secondary)]';

const PrivacyPolicyPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-[var(--color-soapstone-base)] pt-31 text-[var(--color-text-primary)] antialiased">
      <section className="px-4 pb-12 sm:pb-16 lg:pb-20" aria-label="Privacy Policy">
        <Container>
          <article className="mx-auto max-w-3xl rounded-2xl border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] px-6 py-10 sm:px-10 sm:py-12">
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              Останнє оновлення: 12.08.2026
            </p>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-neutral-darkest)] sm:text-4xl">
              Політика конфіденційності
            </h1>

            <p className={paragraphClass}>
              Ця Політика конфіденційності описує, як онлайн-платформа BÜRO.DE (далі — «Платформа»,
              «ми», «наш сервіс») збирає, використовує та захищає персональні дані користувачів.
            </p>
            <p className={paragraphClass}>
              Платформа BÜRO.DE — це онлайн-сервіс для вивчення німецької мови, який надає доступ
              до навчальних курсів, відеоматеріалів та навчальних PDF-матеріалів.
            </p>

            <h2 className={sectionTitleClass}>1. Загальна інформація</h2>
            <p className={paragraphClass}>Оператором платформи BÜRO.DE є:</p>
            <p className={paragraphClass}>
              <strong className="font-semibold text-[var(--color-text-primary)]">
                ФОП Самойлова Анна
              </strong>
            </p>
            <p className={paragraphClass}>
              Адреса:
              <br />
              Україна, м. Київ, вул. Іоанна Павла II, 6/1
            </p>
            <p className={paragraphClass}>
              Email для звернень щодо персональних даних:{' '}
              <a
                href="mailto:burode452@gmail.com"
                className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]"
              >
                burode452@gmail.com
              </a>
            </p>
            <p className={paragraphClass}>
              Ми поважаємо право користувачів на конфіденційність та вживаємо необхідних заходів
              для захисту персональної інформації.
            </p>

            <h2 className={sectionTitleClass}>2. Які персональні дані ми збираємо</h2>
            <p className={paragraphClass}>
              Під час використання Платформи ми можемо збирати такі категорії інформації:
            </p>
            <p className={`${paragraphClass} font-semibold text-[var(--color-text-primary)]`}>
              Дані облікового запису:
            </p>
            <ul className={listClass}>
              <li>ім&apos;я та прізвище (якщо надані користувачем);</li>
              <li>адреса електронної пошти;</li>
              <li>пароль у зашифрованому вигляді;</li>
              <li>інформація про створений обліковий запис.</li>
            </ul>
            <p className={`${paragraphClass} font-semibold text-[var(--color-text-primary)]`}>
              Дані про покупки:
            </p>
            <ul className={listClass}>
              <li>інформація про придбані курси;</li>
              <li>дата та час покупки;</li>
              <li>статус платежу;</li>
              <li>інформація, необхідна для підтвердження оплати.</li>
            </ul>
            <p className={paragraphClass}>
              Оплата здійснюється через платіжний сервіс WayForPay. Обробка платіжних даних
              здійснюється відповідно до правил та політики конфіденційності відповідного
              платіжного сервісу.
            </p>
            <p className={paragraphClass}>
              BÜRO.DE не зберігає повні дані банківських карток користувачів.
            </p>
            <p className={`${paragraphClass} font-semibold text-[var(--color-text-primary)]`}>
              Дані комунікації:
            </p>
            <ul className={listClass}>
              <li>повідомлення, які користувач надсилає через email;</li>
              <li>звернення до служби підтримки.</li>
            </ul>
            <p className={`${paragraphClass} font-semibold text-[var(--color-text-primary)]`}>
              Технічні дані:
            </p>
            <p className={paragraphClass}>Під час використання сайту автоматично можуть збиратися:</p>
            <ul className={listClass}>
              <li>IP-адреса;</li>
              <li>тип браузера;</li>
              <li>інформація про пристрій;</li>
              <li>дата та час відвідування сайту;</li>
              <li>технічні журнали роботи сервісу.</li>
            </ul>

            <h2 className={sectionTitleClass}>3. Для чого ми використовуємо персональні дані</h2>
            <p className={paragraphClass}>Ми використовуємо персональні дані для:</p>
            <ul className={listClass}>
              <li>створення та обслуговування облікового запису користувача;</li>
              <li>надання доступу до придбаних курсів;</li>
              <li>обробки платежів;</li>
              <li>підтвердження покупок;</li>
              <li>забезпечення роботи навчальної платформи;</li>
              <li>надсилання важливих повідомлень щодо роботи сервісу;</li>
              <li>відповіді на звернення користувачів;</li>
              <li>покращення якості навчального сервісу.</li>
            </ul>
            <p className={paragraphClass}>За згодою користувача ми можемо використовувати email-адресу для:</p>
            <ul className={listClass}>
              <li>надсилання новин платформи;</li>
              <li>повідомлень про нові курси;</li>
              <li>освітніх матеріалів;</li>
              <li>спеціальних пропозицій.</li>
            </ul>
            <p className={paragraphClass}>
              Користувач може відмовитися від отримання маркетингових листів у будь-який момент.
            </p>

            <h2 className={sectionTitleClass}>4. Правові підстави обробки даних</h2>
            <p className={paragraphClass}>Ми обробляємо персональні дані на підставі:</p>
            <ul className={listClass}>
              <li>необхідності виконання договору між користувачем та BÜRO.DE;</li>
              <li>згоди користувача;</li>
              <li>виконання законних обов&apos;язків;</li>
              <li>законного інтересу щодо забезпечення роботи та безпеки Платформи.</li>
            </ul>

            <h2 className={sectionTitleClass}>5. Зберігання персональних даних</h2>
            <p className={paragraphClass}>
              Персональні дані зберігаються протягом періоду, необхідного для:
            </p>
            <ul className={listClass}>
              <li>забезпечення доступу користувача до придбаних курсів;</li>
              <li>виконання фінансових та юридичних зобов&apos;язань;</li>
              <li>захисту прав та законних інтересів BÜRO.DE.</li>
            </ul>
            <p className={paragraphClass}>
              Після припинення необхідності зберігання персональні дані можуть бути видалені або
              знеособлені.
            </p>

            <h2 className={sectionTitleClass}>6. Захист персональних даних</h2>
            <p className={paragraphClass}>
              Ми застосовуємо технічні та організаційні заходи для захисту персональної інформації
              користувачів від:
            </p>
            <ul className={listClass}>
              <li>несанкціонованого доступу;</li>
              <li>втрати;</li>
              <li>незаконного використання;</li>
              <li>розголошення.</li>
            </ul>
            <p className={paragraphClass}>
              Однак жоден спосіб передачі або зберігання інформації через Інтернет не може
              гарантувати абсолютну безпеку.
            </p>

            <h2 className={sectionTitleClass}>7. Передача персональних даних третім сторонам</h2>
            <p className={paragraphClass}>
              Ми можемо передавати персональні дані лише у випадках, необхідних для роботи сервісу:
            </p>
            <p className={`${paragraphClass} font-semibold text-[var(--color-text-primary)]`}>
              Платіжний оператор:
            </p>
            <p className={paragraphClass}>
              WayForPay
              <br />
              Для обробки платежів та підтвердження транзакцій.
            </p>
            <p className={`${paragraphClass} font-semibold text-[var(--color-text-primary)]`}>
              Постачальники технічних послуг:
            </p>
            <ul className={listClass}>
              <li>хостинг-провайдери;</li>
              <li>сервіси електронної пошти;</li>
              <li>технічні сервіси, необхідні для роботи платформи.</li>
            </ul>
            <p className={paragraphClass}>
              Ми не продаємо та не передаємо персональні дані користувачів третім особам для
              стороннього маркетингу.
            </p>

            <h2 className={sectionTitleClass}>8. Email-розсилки</h2>
            <p className={paragraphClass}>Користувач може отримувати:</p>
            <ul className={listClass}>
              <li>повідомлення про роботу акаунта;</li>
              <li>інформацію про придбані курси;</li>
              <li>навчальні матеріали;</li>
              <li>новини BÜRO.DE.</li>
            </ul>
            <p className={paragraphClass}>
              Користувач може відписатися від рекламних повідомлень через відповідне посилання у
              листі або звернувшись на:{' '}
              <a
                href="mailto:burode452@gmail.com"
                className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]"
              >
                burode452@gmail.com
              </a>
            </p>

            <h2 className={sectionTitleClass}>9. Cookies</h2>
            <p className={paragraphClass}>
              BÜRO.DE використовує файли cookie для забезпечення коректної роботи сайту.
            </p>
            <p className={paragraphClass}>Cookie можуть використовуватися для:</p>
            <ul className={listClass}>
              <li>авторизації користувача;</li>
              <li>збереження налаштувань;</li>
              <li>покращення роботи платформи.</li>
            </ul>
            <p className={paragraphClass}>
              У майбутньому ми можемо використовувати аналітичні та маркетингові інструменти
              (наприклад Google Analytics або Meta Pixel). У такому випадку відповідні зміни будуть
              внесені до цієї Політики конфіденційності.
            </p>

            <h2 className={sectionTitleClass}>10. Права користувачів</h2>
            <p className={paragraphClass}>Користувач має право:</p>
            <ul className={listClass}>
              <li>отримати інформацію про свої персональні дані;</li>
              <li>вимагати виправлення неточних даних;</li>
              <li>вимагати видалення даних у випадках, передбачених законом;</li>
              <li>відкликати згоду на обробку даних;</li>
              <li>відмовитися від маркетингових повідомлень.</li>
            </ul>
            <p className={paragraphClass}>
              Для реалізації своїх прав зверніться:{' '}
              <a
                href="mailto:burode452@gmail.com"
                className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]"
              >
                burode452@gmail.com
              </a>
            </p>

            <h2 className={sectionTitleClass}>11. Обліковий запис користувача</h2>
            <p className={paragraphClass}>Користувач відповідає за:</p>
            <ul className={listClass}>
              <li>збереження конфіденційності своїх даних для входу;</li>
              <li>достовірність наданої інформації;</li>
              <li>недопущення передачі доступу до акаунта третім особам.</li>
            </ul>
            <p className={paragraphClass}>
              Передача доступу до придбаних курсів іншим особам заборонена.
            </p>

            <h2 className={sectionTitleClass}>12. Інтелектуальна власність</h2>
            <p className={paragraphClass}>
              Усі навчальні матеріали BÜRO.DE, включаючи:
            </p>
            <ul className={listClass}>
              <li>відеоуроки;</li>
              <li>PDF-матеріали;</li>
              <li>вправи;</li>
              <li>тексти;</li>
              <li>дизайн платформи;</li>
            </ul>
            <p className={paragraphClass}>
              є об&apos;єктами інтелектуальної власності та можуть використовуватися лише для
              особистого навчання користувача.
            </p>
            <p className={paragraphClass}>
              Копіювання, поширення, продаж або передача матеріалів третім особам без письмової
              згоди BÜRO.DE заборонені.
            </p>

            <h2 className={sectionTitleClass}>13. Зміни до Політики конфіденційності</h2>
            <p className={paragraphClass}>
              Ми можемо періодично оновлювати цю Політику конфіденційності.
            </p>
            <p className={paragraphClass}>
              Актуальна версія завжди доступна на сайті BÜRO.DE.
            </p>

            <h2 className={sectionTitleClass}>Контакти</h2>
            <p className={paragraphClass}>
              BÜRO.DE
              <br />
              Email:{' '}
              <a
                href="mailto:burode452@gmail.com"
                className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]"
              >
                burode452@gmail.com
              </a>
            </p>
          </article>
        </Container>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
