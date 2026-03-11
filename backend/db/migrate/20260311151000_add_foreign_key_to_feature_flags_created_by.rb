class AddForeignKeyToFeatureFlagsCreatedBy < ActiveRecord::Migration[8.1]
  def change
    add_foreign_key :feature_flags, :users, column: :created_by_id
  end
end
