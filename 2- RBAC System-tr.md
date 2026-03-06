# RBAC Sistemi

## Amaç
Sistemdeki farklı rollerdeki kullanıcıların, rollerine göre business logic ile güvenli ve doğru bir şekilde yönlendirilmesi.

## Benim Geliştirme Akışım

### Backend
1. `application_controller.rb` içine private role guard methodları olarak `require_admin!` ve `require_manager_or_admin!` eklendi.
2. `/api/v1/admin_controller.rb` içine `ping` methodu yazıldı (izole doğrulama için) ve `before_action :require_admin!` ile guard edildi.
3. `/api/v1/manager_controller.rb` içine `ping` methodu yazıldı ve `before_action :require_manager_or_admin!` ile guard edildi.
4. RBAC route’ları `config/routes.rb` içine eklendi (`admin/ping`, `manager/ping`).
5. `authenticate_request` içinde `current_user&.is_active?` kontrolünün satır akışı düzeltildi; `find_by` kullandıldığı için `ActiveRecord::RecordNotFound` beklentisi kaldırıldı.
6. RBAC request spec testleri admin/manager/employee senaryoları için yazıldı.
7. DB’ye gerçek role’lerde örnek kullanıcılar eklendi, curl testleri ile doğrulandı.
8. Rails log + curl çıktıları birlikte kontrol edildi ve RBAC modülü backend tarafında beklenen şekilde çalışır hale geldi.
9. RuboCop ve request testleri sonrası backend RBAC modülü push’a uygun hale geldi.

### Frontend
1. Auth modülünü geliştirirken tanımlanan `UserRole` tipi RBAC için baz alındı.
2. `rbac.ts` içinde `isAdmin` ve `isManagerOrAdmin` helper’ları yazıldı.
3. Dashboard tarafında koşullu UI render role bazlı kurgulandı.
4. `dashboard/page.test.tsx` ile admin/manager görünürlük smoke testleri yazıldı.
5. Test + lint + build kontrolleri sonrası frontend RBAC modülü push’a hazır hale geldi.

## Beklenen Akış
1. Kullanıcı sisteme auth cookie ile giriş yapar.
2. İstek ilgili endpointe gelir (`/api/v1/admin/ping` veya `/api/v1/manager/ping`).
3. Önce `authenticate_request` çalışır, kullanıcı doğrulanır.
4. Sonra role guard çalışır:
   - `require_admin!`
   - `require_manager_or_admin!`
5. Yetki yoksa `403 Forbidden`, auth yoksa `401 Unauthorized`, yetki uygunsa `200 OK` döner.
6. Frontend tarafında role helper’lara göre UI alanları koşullu gösterilir/gizlenir.

## Güvenlik Notları
- RBAC kontrolü sadece frontend’de değil, backend endpoint seviyesinde zorunlu olarak uygulanır.
- Frontend’de UI gizleme sadece UX amaçlıdır; gerçek güvenlik backend guard ile sağlanır.
- Auth + RBAC birlikte çalıştığı için role bypass denemelerinde backend `401/403` döner.

## Riskler / Edge-case
- Sadece frontend’de gizleme yapılıp backend guard unutulursa yetki açığı oluşur.
- Role değerleri string olarak dağınık kullanılırsa yanlış eşleşme riski artar.
- Inactive user ve expired token akışı net ayrıştırılmazsa auth/rbac sonuçları karışabilir.

## Test / Doğrulama
- Manuel (curl):
  - unauth `admin/ping` -> `401`
  - employee `admin/ping` -> `403`
  - employee `manager/ping` -> `403`
  - manager `manager/ping` -> `200`
  - manager `admin/ping` -> `403`
  - admin `admin/ping` -> `200`
  - admin `manager/ping` -> `200`
- Otomatik:
  - Backend `rbac_spec.rb` geçti
  - Backend `auth_spec.rb` geçti
  - Frontend dashboard role smoke testleri geçti
  - Frontend lint/build geçti

## Benim Özetim
RBAC modülü backend ve frontend tarafında role bazlı kontrol mantığıyla çalışır durumda.
Endpoint bazlı guard yapısı sayesinde güvenlik tarafında net bir yetki duvarı kuruldu.
Bir sonraki adımda feature flag CRUD + rollout logic ile RBAC’i gerçek iş akışıyla birleştirerek devam edeceğim.

## Benim Geliştirme Algoritmam
`modül -> ön/arka yüz entegre -> modülerlik -> test -> log -> güvenlik -> performans -> commit`