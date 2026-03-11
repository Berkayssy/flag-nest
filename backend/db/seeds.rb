# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

User.find_or_create_by!(email: "admin@flag-nest.com") do |u|
  u.name = "Admin User"
  u.password = "password"
  u.password_confirmation = "password"
  u.role = "admin"
  u.is_active = true
end

User.find_or_create_by!(email: "manager@flag-nest.com") do |u|
  u.name = "Manager User"
  u.password = "password"
  u.password_confirmation = "password"
  u.role = "manager"
  u.is_active = true
end

User.find_or_create_by!(email: "employee@flag-nest.com") do |u|
  u.name = "Employee User"
  u.password = "password"
  u.password_confirmation = "password"
  u.role = "employee"
  u.is_active = true
end

admin = User.find_by!(email: "admin@flag-nest.com")

flag = FeatureFlag.find_or_create_by!(key: "new_billing_ui") do |f|
  f.name = "New Billing UI"
  f.enabled = false
  f.description = "Billing page redesign"
  f.created_by_id = admin.id
end

RolloutRule.find_or_create_by!(feature_flag_id: flag.id, rule_type: "percentage") do |r|
  r.value = nil
  r.percentage = 25
  r.active = true
end
