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

const TermsOfServicePage = () => {
  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-[var(--color-soapstone-base)] pt-31 text-[var(--color-text-primary)] antialiased">
      <section className="px-4 pb-12 sm:pb-16 lg:pb-20" aria-label="Terms of Service">
        <Container>
          <article className="mx-auto max-w-3xl rounded-2xl border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] px-6 py-10 sm:px-10 sm:py-12">
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              Останнє оновлення: 13.08.2026
            </p>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-neutral-darkest)] sm:text-4xl">
              Умови використання
            </h1>

            <p className={paragraphClass}>
              Ці Умови використання (далі - «Умови») визначають правила користування
              онлайн-платформою BÜRO.DE, яка надає доступ до онлайн-курсів з вивчення німецької
              мови, відеоматеріалів та навчальних матеріалів.
            </p>
            <p className={paragraphClass}>
              Використовуючи сайт BÜRO.DE, створюючи обліковий запис або купуючи курс, користувач
              підтверджує, що ознайомився з цими Умовами та погоджується їх дотримуватися.
            </p>

            <h2 className={sectionTitleClass}>1. Загальна інформація</h2>
            <p className={paragraphClass}>
              BÜRO.DE - онлайн-платформа для вивчення німецької мови.
            </p>
            <p className={paragraphClass}>Оператор платформи:</p>
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
              Email:
              <br />
              {contactEmail}
            </p>

            <h2 className={sectionTitleClass}>2. Основні поняття</h2>
            <p className={paragraphClass}>У цих Умовах:</p>
            <p className={`${paragraphClass} font-semibold text-[var(--color-text-primary)]`}>
              Платформа
            </p>
            <p className={paragraphClass}>
              - вебсайт BÜRO.DE та всі пов&apos;язані з ним цифрові сервіси.
            </p>
            <p className={`${paragraphClass} font-semibold text-[var(--color-text-primary)]`}>
              Користувач
            </p>
            <p className={paragraphClass}>
              - фізична особа, яка створила обліковий запис або використовує матеріали платформи.
            </p>
            <p className={`${paragraphClass} font-semibold text-[var(--color-text-primary)]`}>
              Курс
            </p>
            <p className={paragraphClass}>- цифровий освітній продукт, що може включати:</p>
            <ul className={listClass}>
              <li>відеоуроки;</li>
              <li>навчальні матеріали;</li>
              <li>PDF-файли;</li>
              <li>вправи;</li>
              <li>додаткові освітні ресурси.</li>
            </ul>
            <p className={`${paragraphClass} font-semibold text-[var(--color-text-primary)]`}>
              Особистий кабінет
            </p>
            <p className={paragraphClass}>
              - персональний обліковий запис користувача для доступу до придбаних курсів.
            </p>

            <h2 className={sectionTitleClass}>3. Реєстрація облікового запису</h2>
            <p className={subSectionTitleClass}>3.1.</p>
            <p className={paragraphClass}>
              Для отримання доступу до курсів користувач може бути зобов&apos;язаний створити
              особистий акаунт.
            </p>
            <p className={subSectionTitleClass}>3.2.</p>
            <p className={paragraphClass}>
              Під час реєстрації користувач зобов&apos;язаний надати достовірну інформацію.
            </p>
            <p className={subSectionTitleClass}>3.3.</p>
            <p className={paragraphClass}>Користувач відповідає за:</p>
            <ul className={listClass}>
              <li>правильність зазначених даних;</li>
              <li>безпеку свого пароля;</li>
              <li>усі дії, здійснені через його акаунт.</li>
            </ul>
            <p className={subSectionTitleClass}>3.4.</p>
            <p className={paragraphClass}>Заборонено:</p>
            <ul className={listClass}>
              <li>створювати акаунти від імені інших осіб;</li>
              <li>використовувати чужий акаунт;</li>
              <li>передавати власний доступ до курсу третім особам.</li>
            </ul>

            <h2 className={sectionTitleClass}>4. Доступ до навчальних матеріалів</h2>
            <p className={subSectionTitleClass}>4.1.</p>
            <p className={paragraphClass}>
              Після успішної оплати користувач отримує доступ до придбаного курсу через особистий
              кабінет.
            </p>
            <p className={subSectionTitleClass}>4.2.</p>
            <p className={paragraphClass}>Доступ до матеріалів є персональним.</p>
            <p className={subSectionTitleClass}>4.3.</p>
            <p className={paragraphClass}>
              Якщо інше не зазначено в описі конкретного курсу, доступ надається безстроково
              протягом періоду існування платформи BÜRO.DE.
            </p>
            <p className={subSectionTitleClass}>4.4.</p>
            <p className={paragraphClass}>BÜRO.DE залишає за собою право:</p>
            <ul className={listClass}>
              <li>оновлювати навчальні матеріали;</li>
              <li>змінювати структуру курсів;</li>
              <li>покращувати функціонал платформи.</li>
            </ul>
            <p className={paragraphClass}>
              Такі зміни не повинні погіршувати доступ користувача до вже придбаного курсу.
            </p>

            <h2 className={sectionTitleClass}>5. Правила використання матеріалів</h2>
            <p className={subSectionTitleClass}>5.1.</p>
            <p className={paragraphClass}>
              Навчальні матеріали BÜRO.DE створені виключно для особистого навчання користувача.
            </p>
            <p className={subSectionTitleClass}>5.2.</p>
            <p className={paragraphClass}>Користувачу заборонено:</p>
            <ul className={listClass}>
              <li>копіювати матеріали курсу;</li>
              <li>передавати їх іншим особам;</li>
              <li>публікувати матеріали у відкритому доступі;</li>
              <li>продавати або використовувати матеріали у комерційних цілях;</li>
              <li>записувати відеоуроки або поширювати їх.</li>
            </ul>
            <p className={subSectionTitleClass}>5.3.</p>
            <p className={paragraphClass}>
              PDF-матеріали можуть бути доступні для перегляду на платформі відповідно до
              функціоналу сайту.
            </p>

            <h2 className={sectionTitleClass}>6. Інтелектуальна власність</h2>
            <p className={subSectionTitleClass}>6.1.</p>
            <p className={paragraphClass}>
              Усі матеріали BÜRO.DE є об&apos;єктами інтелектуальної власності.
            </p>
            <p className={paragraphClass}>До них належать:</p>
            <ul className={listClass}>
              <li>відеоуроки;</li>
              <li>тексти;</li>
              <li>презентації;</li>
              <li>PDF-матеріали;</li>
              <li>вправи;</li>
              <li>методичні розробки;</li>
              <li>дизайн платформи;</li>
              <li>бренд BÜRO.DE.</li>
            </ul>
            <p className={subSectionTitleClass}>6.2.</p>
            <p className={paragraphClass}>
              Придбання курсу не означає передачу прав власності на навчальні матеріали.
            </p>
            <p className={subSectionTitleClass}>6.3.</p>
            <p className={paragraphClass}>
              Користувач отримує лише право особистого використання матеріалів для навчання.
            </p>

            <h2 className={sectionTitleClass}>7. Оплата та доступ до курсів</h2>
            <p className={subSectionTitleClass}>7.1.</p>
            <p className={paragraphClass}>
              Оплата курсів здійснюється через платіжний сервіс WayForPay.
            </p>
            <p className={subSectionTitleClass}>7.2.</p>
            <p className={paragraphClass}>
              Після підтвердження платежу користувачу відкривається доступ до придбаного продукту.
            </p>
            <p className={subSectionTitleClass}>7.3.</p>
            <p className={paragraphClass}>Вартість курсів зазначається на сайті BÜRO.DE.</p>
            <p className={subSectionTitleClass}>7.4.</p>
            <p className={paragraphClass}>
              Умови повернення коштів регулюються Публічною офертою BÜRO.DE.
            </p>

            <h2 className={sectionTitleClass}>8. Відповідальність користувача</h2>
            <p className={paragraphClass}>Користувач погоджується:</p>
            <ul className={listClass}>
              <li>використовувати платформу відповідно до закону;</li>
              <li>не здійснювати дії, які можуть пошкодити роботу сайту;</li>
              <li>не намагатися отримати несанкціонований доступ до системи;</li>
              <li>не передавати доступ до курсів третім особам.</li>
            </ul>
            <p className={paragraphClass}>У разі порушення цих правил BÜRO.DE має право:</p>
            <ul className={listClass}>
              <li>обмежити доступ користувача;</li>
              <li>заблокувати акаунт;</li>
              <li>
                припинити надання послуг без компенсації у випадках грубого порушення умов.
              </li>
            </ul>

            <h2 className={sectionTitleClass}>9. Відповідальність BÜRO.DE</h2>
            <p className={paragraphClass}>BÜRO.DE докладає зусиль для забезпечення:</p>
            <ul className={listClass}>
              <li>стабільної роботи платформи;</li>
              <li>доступності придбаних курсів;</li>
              <li>актуальності навчальних матеріалів.</li>
            </ul>
            <p className={paragraphClass}>Водночас BÜRO.DE не гарантує:</p>
            <ul className={listClass}>
              <li>конкретного рівня володіння німецькою мовою після проходження курсу;</li>
              <li>складання іспитів;</li>
              <li>працевлаштування або інших персональних результатів.</li>
            </ul>
            <p className={paragraphClass}>
              Результат навчання залежить від регулярності занять та особистої участі користувача.
            </p>

            <h2 className={sectionTitleClass}>10. Технічні роботи</h2>
            <p className={paragraphClass}>
              BÜRO.DE може тимчасово обмежувати доступ до платформи для:
            </p>
            <ul className={listClass}>
              <li>технічного обслуговування;</li>
              <li>оновлення системи;</li>
              <li>покращення сервісу.</li>
            </ul>
            <p className={paragraphClass}>
              За можливості користувачі можуть бути попереджені про планові роботи.
            </p>

            <h2 className={sectionTitleClass}>11. Комунікація з користувачами</h2>
            <p className={paragraphClass}>BÜRO.DE може надсилати користувачам:</p>
            <ul className={listClass}>
              <li>повідомлення щодо акаунта;</li>
              <li>інформацію про придбані курси;</li>
              <li>оновлення платформи;</li>
              <li>освітні матеріали;</li>
              <li>новини та пропозиції (за згодою користувача).</li>
            </ul>
            <p className={paragraphClass}>
              Користувач може відмовитися від маркетингових листів у будь-який момент.
            </p>

            <h2 className={sectionTitleClass}>12. Припинення користування платформою</h2>
            <p className={paragraphClass}>
              Користувач може припинити використання платформи у будь-який момент.
            </p>
            <p className={paragraphClass}>BÜRO.DE може обмежити або припинити доступ у випадку:</p>
            <ul className={listClass}>
              <li>порушення цих Умов;</li>
              <li>незаконного використання матеріалів;</li>
              <li>спроб пошкодження роботи платформи.</li>
            </ul>

            <h2 className={sectionTitleClass}>13. Захист персональних даних</h2>
            <p className={paragraphClass}>
              Обробка персональних даних користувачів здійснюється відповідно до:
            </p>
            <p className={paragraphClass}>
              <Link
                to={ROUTES.PRIVACY}
                className="font-semibold text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]"
              >
                Політики конфіденційності BÜRO.DE
              </Link>
            </p>
            <p className={paragraphClass}>яка є невід&apos;ємною частиною використання платформи.</p>

            <h2 className={sectionTitleClass}>14. Зміни до Умов використання</h2>
            <p className={paragraphClass}>
              BÜRO.DE може оновлювати ці Умови для покращення роботи платформи або відповідності
              законодавству.
            </p>
            <p className={paragraphClass}>
              Нова редакція набирає чинності після публікації на сайті.
            </p>

            <h2 className={sectionTitleClass}>15. Контакти</h2>
            <p className={paragraphClass}>
              BÜRO.DE
              <br />
              ФОП Самойлова Анна
              <br />
              Україна, м. Київ, вул. Іоанна Павла II, 6/1
              <br />
              Email:
              <br />
              {contactEmail}
            </p>

            <p className={`${paragraphClass} mt-8 border-t border-[var(--opacity-neutral-darkest-15)] pt-8`}>
              Використовуючи платформу BÜRO.DE, користувач підтверджує, що прочитав ці Умови та
              погоджується з ними.
            </p>
          </article>
        </Container>
      </section>
    </div>
  );
};

export default TermsOfServicePage;
