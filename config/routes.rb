Rails.application.routes.draw do
  root to: 'pages#index'
  match '/api/*path' => 'pages#proxy', via: [:get, :post, :put, :patch, :delete]
  match '/csrfToken' => 'pages#proxy', via: [:get]
end
