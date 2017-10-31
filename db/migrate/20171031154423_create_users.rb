class CreateUsers < ActiveRecord::Migration
  def change
      create_table :users do |t|
        t.string :encrypted_password
        t.string :salt
        t.string :email
        t.string :login
        t.boolean :confirmed
        t.string :confirmation_token
        t.references :role
      end
  end
end