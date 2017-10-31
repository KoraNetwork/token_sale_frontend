Rails.application.routes.draw do
  resources :country_flags, only: [:index]
  root to: 'pages#index'
  scope '(:locale)' do
    resources :pages, only:[] do
       get :check_session
    end
    resources :sessions, only: [:create] do
      collection do
        delete :destroy
        get :check
      end
    end

    get '/app', to: 'pages#app'
    resources :users, only: [:create] do
      collection do
        post :email_available
        get :confirm_email
      end
    end
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
