# Rollout Rules

## Amaç
Sisteme eklenen feature_flag’lerin, uygun rollerdeki kullanıcılar tarafından RBAC + CRUD yapılarının üzerine eklenerek kontrollü şekilde yayılmasını sağlamak.

## Benim Geliştirme Akışım

### Backend
1. `bin/rails generate` komutu ile `RolloutRule` migration’ı üretildi (`feature_flag` ilişkili).
2. Migration içindeki alanlar düzenlendi:
   - `rule_type` (default: `percentage`)
   - `percentage`
   - `active` (default: `true`)
3. Performans için `[:feature_flag_id, :active]` index eklendi.
4. `app/models/rollout_rule.rb` oluşturuldu.
5. `feature_flag.rb` içine `has_many :rollout_rules` ilişkisi eklendi.
6. Temel validasyonlar eklendi (`rule_type`, `percentage`).
7. `Api::V1::RolloutRulesController` oluşturuldu.
8. Action’lar yazıldı: `index`, `create`, `update`, `destroy`.
9. `set_feature_flag` ve `set_rollout_rule` helper methodları eklendi.
10. `rollout_rule_params` ile strong params eklendi.
11. RBAC guardları eklendi:
    - read: `require_manager_or_admin!`
    - write: `require_admin!`
12. Route yapısı resources ile nested + flat olarak eklendi:
    - nested: `feature_flags/:feature_flag_id/rollout_rules`
    - flat: `rollout_rules/:id`
13. `spec/requests/rollout_rules_spec.rb` yazıldı.
14. Tüm request testleri geçtiğinde backend push’a hazır hale geldi.

### Frontend
1. `src/types/rollout-rule.ts` oluşturuldu.
2. Rollout veri tipleri tek yerden yönetilecek şekilde yazıldı.
3. `src/lib/rollout-rules-api.ts` oluşturuldu.
4. Backend route’larıyla uyumlu API fonksiyonları eklendi (`list/create/update/delete`).
5. `dashboard/page.tsx` içine rollout state + fetch + action fonksiyonları eklendi.
6. Role-based UI davranışı uygulandı:
   - admin: create/update/delete
   - manager: read only
7. Rollout için minimal UI bileşenleri eklendi.
8. `dashboard/page.test.tsx` içine role bazlı rollout testleri eklendi.
9. `test + lint + build` başarılı geçince frontend push’a hazır hale geldi.

## Beklenen Akış
1. Kullanıcı auth cookie ile giriş yapar.
2. Dashboard’da feature flags listesi çekilir.
3. Seçilen `feature_flag_id` için rollout rules listesi çağrılır.
4. Manager/Admin rollout listesini görebilir.
5. Admin yeni rollout rule ekleyebilir (`percentage`, `active`).
6. Admin rollout rule güncelleyebilir/silebilir.
7. Geçersiz veya olmayan `feature_flag_id` için sistem `404` döner.
8. Yetkisiz isteklerde `401/403` contract’ı korunur.

## Güvenlik Notları
- Rollout yetkisi sadece backend guard ile korunur, frontend UI gizleme tek başına güvenlik değildir.
- Read ve write yetkileri ayrılmıştır (`manager/admin` vs `admin`).
- Nested route yapısı ile rule’ların hangi feature flag’e ait olduğu net tutulur.
- Geçersiz id isteklerinde `404` dönerek kaynak varlığı sızdırılmaz.

## Riskler / Edge-case
- Dashboard’da manuel id girişi yapılırsa yanlış id’lerde sürekli `404` logu oluşabilir.
- Route naming (`feature_flags` vs `feature-flags`) karışırsa frontend entegrasyonu kırılır.
- `create` action’da `:created` unutulursa status contract testten kırılır.
- Role kontrolü sadece frontend’de yapılırsa yetki açığı oluşur.
- `percentage` validasyonu zayıf kalırsa rollout davranışı bozulabilir.

## Test / Doğrulama
- Backend:
  - `bundle exec rspec spec/requests/rollout_rules_spec.rb` -> geçti
  - Full request suite (`auth + rbac + feature_flags + rollout_rules`) -> geçti
- Frontend:
  - `npm run test:run` -> geçti
  - `npm run lint` -> geçti
  - `npm run build` -> geçti
- Manuel log kontrolü:
  - valid id -> `200`
  - invalid id -> `404`
  - employee feature_flags -> `403`
  - auth flow -> `200/401` beklenen şekilde

## Benim Özetim
Rollout Rules modülü backend ve frontend tarafında role bazlı çalışır durumda.
Admin rollout kuralı ekleyip yönetebiliyor, manager sadece görüntüleyebiliyor.
RBAC + CRUD + route + test bütünlüğü sağlandı, Step 4 tamamlandı.

## Benim Geliştirme Algoritmam
`modül -> ön/arka yüz entegre -> modülerlik -> test -> log -> güvenlik -> performans -> commit`