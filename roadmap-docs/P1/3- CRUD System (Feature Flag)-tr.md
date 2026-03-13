# CRUD Sistemi (Feature Flag)

## Amaç
Farklı rollerdeki kullanıcılara, gereken yetkiler verilerek sistemin güvenli bir şekilde role bazlı aksiyon almasını sağlamak.

## Benim Geliştirme Akışım

### Backend
1. Feature Flag yapısı için Rails generate komutu kullanılarak DB’ye gerekli satır/sütunlar oluşturulur.
2. `db/migrate` altında oluşan timestamp’li dosya düzenlenir, ardından `rails db:migrate` ile şemaya işlenir.
3. `app/models` altında `feature_flag.rb` model dosyası oluşturulur ve temel validasyonlar eklenir.
4. `app/controllers/api/v1` altında `feature_flags_controller.rb` oluşturulur ve CRUD (`index/create/update/destroy`) methodları yazılır.
5. Controller içine RBAC guard’ları eklenir:
   - `index` için `require_manager_or_admin!`
   - `create/update/destroy` için `require_admin!`
6. `set_feature_flag` methodu yazılır ve `before_action` ile update/destroy öncesi kayıt bulma kuralı eklenir.
7. `feature_flag_params` ile strong params sözleşmesi tanımlanır (`params.require(:feature_flag)...`).
8. `routes.rb` içine `resources :feature_flags, only: %i[index create update destroy]` eklenir.
9. `rails routes` ile endpointler doğrulanır.
10. `feature_flags_spec.rb` içine temel request testleri yazılır.
11. Create action’daki status bug’ı bulunur; default `200` değeri `:created` ile düzeltilir.
12. Tüm testler geçtikten sonra backend push’a hazır hale gelir.

### Frontend
1. Feature Flag API yönetimini tek yerden yapmak için `feature-flags-api.ts` modülü oluşturulur.
2. `/api/v1/feature_flags` için type yapısı tanımlanır.
3. `list` ve `create` çağrıları aynı modülde merkezi şekilde yönetilir.
4. `dashboard/page.tsx` altında feature flag modülü entegre edilir.
5. Sayfa açıldığında `flag_list` çekilir, `loading/error` stateleri birlikte render edilir.
6. Admin rolündeki kullanıcılar için create flag akışı eklenir. Form sadece admin için görünür olur.
7. `+ Create` butonu ile form açılır/kapanır, submit sonrası `flag_list` refresh edilir.
8. Role-based UI davranışı test edilir. RBAC helper (`isAdmin`, `isManagerOrAdmin`) ile koşullu render korunur.
9. Böylece admin ve diğer rollerin davranışları sistemde ayrıştırılmış olur.
10. UI minimal ve sistemle uyumlu hale getirilir; test/lint/build kontrolleri sonrası frontend push’a hazır hale gelir.

## Beklenen Akış
1. Kullanıcı auth ile sisteme giriş yapar.
2. Dashboard açıldığında feature flag listesi backend’den çekilir.
3. Role kontrolü backend’de guard ile yapılır.
4. Admin kullanıcı create/update/destroy yapabilir.
5. Manager kullanıcı listeyi görebilir ama create/update/destroy yapamaz.
6. Employee kullanıcı feature flag endpointinde yetki alamaz.
7. Frontend tarafı role’a göre doğru alanları gösterir/gizler.

## Güvenlik Notları
- Yetki kontrolü sadece frontend’de değil backend endpoint seviyesinde zorunlu uygulanır.
- Frontend’de UI gizleme sadece UX amaçlıdır, gerçek güvenlik backend guard’dadır.
- Auth + RBAC + CRUD birlikte çalışarak role dışı aksiyonları engeller.

## Riskler / Edge-case
- Strong params formatı (`feature_flag` nested) bozulursa `400 Bad Request` alınır.
- Create action’da status doğru set edilmezse API kontratı bozulur (`200` yerine `201` beklenir).
- Key alanı unique olduğu için duplicate create denemelerinde validation error döner.
- Sadece frontend’e güvenilip backend guard unutulursa yetki açığı oluşur.

## Test / Doğrulama
- Otomatik:
  - `auth_spec.rb` geçti
  - `rbac_spec.rb` geçti
  - `feature_flags_spec.rb` geçti
  - frontend vitest/lint/build geçti
- Manuel:
  - curl ile role bazlı endpoint erişimleri doğrulandı
  - admin create başarılı, manager/employee yetki engeli doğrulandı
  - UI’da role bazlı görünürlük davranışı kontrol edildi

## Benim Özetim
CRUD (Feature Flag) modülü backend ve frontend tarafında role bazlı güvenli şekilde entegre edildi.
Auth + RBAC üstüne gerçek işlevsel bir modül eklenmiş oldu.
Bir sonraki adım rollout kuralları ve hedefli yayın mantığını bu modüle bağlamak olacak.

## Benim Geliştirme Algoritmam
`modül -> ön/arka yüz entegre -> modülerlik -> test -> log -> güvenlik -> performans -> commit`