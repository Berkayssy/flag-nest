class CreateFeatureFlags < ActiveRecord::Migration[8.1]
  def change
    create_table :feature_flags do |t|
      t.string :name, null: false
      t.string :key, null: false
      t.boolean :enabled, null: false, default: false
      t.text :description
      t.bigint :created_by_id, null: false

      t.timestamps
    end

    add_index :feature_flags, :key, unique: true
    add_index :feature_flags, :created_by_id
  end
end
