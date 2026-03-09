class CreateAuditLogs < ActiveRecord::Migration[8.1]
  def change
    create_table :audit_logs do |t|
      t.references :user, null: false, foreign_key: true
      t.string :action, null: false
      t.string :resource_type, null: false
      t.bigint :resource_id, null: false
      t.jsonb :metadata, null: false, default: {}

      t.timestamps
    end

    add_index :audit_logs, %i[ resource_type resource_id ]
    add_index :audit_logs, :created_at
  end
end
