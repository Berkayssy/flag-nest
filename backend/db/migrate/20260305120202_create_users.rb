class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :role, null: false, default: "employee"
      t.boolean :is_active, null: false, default: true
      t.bigint :company_id

      t.timestamps
    end

    add_index :users, :email, unique: true
    add_index :users, :company_id
  end
end
