class User < ApplicationRecord
    has_secure_password

    ROLES = %w[employee manager admin].freeze

    before_validation :normalize_email

    validates :name, presence: true
    validates :email, presence: true, uniqueness: { case_sensitive: false }
    validates :role, inclusion: { in: ROLES }
    validates :password, length: { minimum: 6 }, if: -> { password.present? }

    private

    def normalize_email
        self.email = email.to_s.downcase.strip
    end
end
