class CreateRolloutRules < ActiveRecord::Migration[8.1]
  def change
    create_table :rollout_rules do |t|
      t.references :feature_flag, null: false, foreign_key: true
      t.string :rule_type, default: "percentage", null: false
      t.string :value
      t.integer :percentage, null: false
      t.boolean :active, default: true, null: false

      t.timestamps
    end

    add_index :rollout_rules, %i[ feature_flag_id, :active ]
  end
end
