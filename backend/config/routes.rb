Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  # API routes
  namespace :api do
    namespace :v1 do
      # Feature flag routes
      resources :feature_flags, only: %i[index create update destroy]

      # Authentication routes
      post "auth/login", to: "auth#login"
      get "auth/me", to: "auth#me"
      post "auth/logout", to: "auth#logout"

      # RBAC-protected routes
      get "admin/ping", to: "admin#ping"
      get "manager/ping", to: "manager#ping"
    end
  end
end
