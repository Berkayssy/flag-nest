# Audit Log

## Amaç
Sistemde yapılan kritik aksiyonların (feature flag ve rollout işlemleri) kim tarafından, ne zaman ve hangi kaynak üzerinde yapıldığını izlenebilir hale getirmek.

## Benim Geliştirme Akışım

### Backend
1. `audit_logs` migration’ı Rails generate komutu ile gerekli veri tipleri girilerek oluşturulur.
2. Migration alanları tanımlanır ve performans için indexler eklenir.
3. Migration çalıştırılır, ardından `AuditLog` modeline geçilir.
4. `AuditLog` modeline `belongs_to :user` eklenir (ilişkisel yapı kurulmuş olur).
5. Temel validasyonlar eklenir.
6. `User` modeline `has_many :audit_logs` eklenir (iki model arası ilişki tamamlanır).
7. `ApplicationController` içine ortak helper method (`log_audit!`) eklenir.
8. `FeatureFlagsController` içindeki `create/update/destroy` action’larına audit log yazımı eklenir.
9. Aynı şekilde `RolloutRulesController` içindeki `create/update/destroy` action’larına audit log yazımı eklenir.
10. `Api::V1::AuditLogsController` oluşturulur.
11. `GET /api/v1/audit_logs` endpointi eklenir.
12. `AuditLogsController#index` için RBAC guard eklenir.
13. `routes.rb` içine audit log route’u eklenir.
14. `audit_logs_spec.rb` dosyası oluşturulur ve temel test senaryoları yazılır.
15. Full test ve kalite kontrolleri sonrası backend push’a hazır hale getirilir.

### Frontend
1. `audit-log.ts` ile type dosyası oluşturulur.
2. `audit-logs-api.ts` ile API yönetimi sağlanır.
3. Dashboard’a audit state eklenir.
4. Audit listesi için fetch ve mount/refetch fonksiyonları eklenir.
5. `Audit Activity` bölümündeki mock veriler temizlenir, yerine gerçek API verisi eklenir.
6. Role bazlı görünürlük korunur.
7. Dashboard role testlerine audit testleri eklenir.
8. `test + lint + build` başarılı geçtikten sonra frontend push’a hazır hale gelir.

## Beklenen Akış
1. Admin/manager kullanıcı dashboard’u açar.
2. Sistem `GET /api/v1/audit_logs` çağrısı yapar.
3. Backend son kayıtları zaman sırasına göre döner.
4. Frontend kayıtları `Audit Activity` alanında listeler.
5. Feature flag veya rollout create/update/delete olduğunda yeni audit kaydı oluşur.
6. Employee kullanıcı audit endpointine erişmeye çalışırsa `403` döner.
7. Auth olmayan isteklerde `401` döner.

## Güvenlik Notları
- Audit log endpointi role guard ile korunur.
- Log kayıtları backend action seviyesinde üretilir, frontend’e bağlı değildir.
- `metadata` alanı kontrollü genişleme için hazır tutulur.
- Auth + RBAC birlikte çalışarak log erişimini sınırlar.

## Riskler / Edge-case
- Action isimleri tutarsız yazılırsa log analizi zorlaşır.
- Çok hızlı artan log verisi için pagination ihtiyacı duyulması muhtemel.
- Frontend’de sürekli refetch yapılması gereksiz istek üretebilir.
- Hatalı role guard yazımı audit endpointini yanlışlıkla açıp kapatabilir.

## Test / Doğrulama
- Backend:
  - `audit_logs_spec.rb` geçti
  - Full request suite geçti
- Frontend:
  - `npm run test:run` geçti
  - `npm run lint` geçti
  - `npm run build` geçti
- Manuel:
  - admin/manager audit listesi `200`
  - employee `403`
  - unauth `401`

## Benim Özetim
Audit log modülü ile sistemdeki kritik değişiklikler izlenebilir hale geldi.
Backend tarafında otomatik log üretimi, frontend tarafında gerçek logların görüntülenmesi tamamlandı.
Step 5 ile birlikte operasyonel görünürlük güçlendi.

## Benim Geliştirme Algoritmam
`modül -> ön/arka yüz entegre -> modülerlik -> test -> log -> güvenlik -> performans -> commit`