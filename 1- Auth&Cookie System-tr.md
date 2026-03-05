# Auth Cookie Sistemi

## Amaç
Frontend'den login olmaya çalışan kullanıcının giriş bilgisini JWT token üretip HttpOnly cookie içinde taşımak ve modern, JS tabanlı saldırılara karşı daha güvenlikli bir Auth sistemi kurmak.

## Benim Geliştirme Akışım

### Backend
1. Rails API formatında backend, Next route formatında frontend kurulur.
2. Tek yerden API yönetimi için `api/v1/[...path]/route.ts` yapısında proxy katmanı kurgulanır.
3. `ApplicationController` içine cookie helper ve auth yardımcı methodları eklenir.
4. `config/routes.rb` içine `login`, `me`, `logout` endpointleri eklenir.
5. `AuthController` oluşturulur; `login`, `me`, `logout` methodları yazılır, `login` hariç endpointler `:authenticate_request` ile korunur.
6. `ApplicationController` içinde `issue_auth_cookie`, `authenticate_request`, JWT encode/decode ve ortak response methodları eklenir.
7. `curl` / Postman gibi araçlarla endpointler manuel test edilir, hatalar düzeltilir.
8. `User` modeli oluşturulur ve auth testi için örnek user hazırlanır.
9. Migration generate edilir, `rails db:migrate` ile tabloya işlenir.
10. `bundle install` ile gerekli gemler kurulur (`bcrypt`, `jwt`, `rspec`).
11. Çıkan hatalara göre `application.rb` tarafında gerekli middleware/config güncellemeleri yapılır.
12. Frontend ile entegre, tutarlı response formatı netleştirilir.
13. `spec/requests/auth_spec.rb` ile auth akışı ve status code testleri yazılır.
14. Testler + RuboCop kontrolü sonrası Auth core modülü push’a uygun hale getirilir.

### Frontend
1. Auth modülü `api`, `types`, `contexts`, `lib` olarak parçalanıp modüler Next klasör yapısı kurulur.
2. `auth.ts` içine backend ile uyumlu veri tipleri yazılır.
3. `auth-api.ts` ile auth isteklerinin tek yerden yönetimi sağlanır.
4. `auth-context.tsx` ile auth state tek context altında toplanır; provider ile child yapısında sarmalanır.
5. Minimal `home`, `login`, `dashboard`, `logout` akışları ve componentleri oluşturulur.
6. Global style/type kaynaklı Next hataları için gerekli type/css düzenlemeleri yapılır.
7. Minimal ve tutarlı bir UI-UX için Tailwind düzenlemeleri uygulanır.
8. Lint ve manuel akış testleri sonrası frontend auth modülü commit/push’a hazır hale getirilir.

## Beklenen Akış
1. Kullanıcı login ekranında formu doldurur ve login isteği gönderir. Next isteği `/api/v1/auth/login` endpointine proxy eder.
2. İstek Rails `routes.rb` üzerinden `AuthController` içine yönlendirilir.
3. `AuthController#login` email ile user’ı bulur; doğrulama başarılıysa token üretilir, auth cookie set edilir ve `200 OK` + `render_success` döner.
4. `ApplicationController` tarafındaki cookie/auth methodları (`issue_auth_cookie`, `authenticate_request`) akışı tamamlar.
5. Tarayıcı HttpOnly cookie’yi saklar, kullanıcı giriş yapmış olur (`200 OK`).
6. `auth/me` çağrısı login öncesi `401`, login sonrası `200` döner.
7. Logout sırasında cookie `cookies.delete` ile temizlenir; oturum döngüsü bu şekilde kapanır.

## Güvenlik Notları
- HttpOnly cookie, auth token’a JavaScript erişimini engeller.
- `SameSite` ve `Secure` ayarları ortam bazlı (dev/prod) şekilde yönetilir.
- Bu adım auth session temelini kapsar; CSRF/rate-limit ve diğer hardening adımları ayrı güvenlik adımında ele alınır.

## Riskler / Edge-case
- Cookie `SameSite/Secure` ayarları prod ortamda yanlış kalırsa login akışı kırılabilir.
- Proxy katmanında `Set-Cookie` doğru taşınmazsa `auth/me` sürekli `401` döner.
- Token süresi dolduğunda kullanıcı tarafında session yenileme davranışı net yönetilmezse UX bozulabilir.
- Sadece frontend'de route gizlemek yetmez; backend'de endpoint guard zorunlu olmalı.

## Test / Doğrulama
- Manuel:
  - Login öncesi `GET /api/v1/auth/me -> 401`
  - `POST /api/v1/auth/login -> 200`
  - Login sonrası `GET /api/v1/auth/me -> 200`
  - `POST /api/v1/auth/logout -> 200`
  - Logout sonrası tekrar `GET /api/v1/auth/me -> 401`
- Otomatik:
  - Backend RuboCop başarılı
  - Backend `auth_spec.rb -> 5/5 passed`
  - Frontend lint ve build başarılı
  - Frontend auth smoke testleri (home/login) başarılı

## Benim Özetim
Auth & Cookie modülü backend ve frontend tarafında entegre ve çalışır durumda.
JWT + HttpOnly cookie yaklaşımı ile temel session güvenliği sağlandı, testlerle doğrulandı.
Bir sonraki adımda RBAC ile endpoint bazlı yetki duvarını netleştirip sistemi role-based hale getireceğim.

## Benim Geliştirme Algoritmam
`modül -> ön/arka yüz entegrasyonu -> modülerlik -> test -> log -> güvenlik -> performans -> commit`
