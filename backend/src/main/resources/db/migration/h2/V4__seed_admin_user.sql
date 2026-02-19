-- Insert admin user with password 'Admin@123' (BCrypt encoded)
INSERT INTO users (username, email, password_hash, first_name, last_name, is_active)
VALUES ('admin', 'admin@ehrclinic.com', '$2a$12$LJ3a4UNIxoV6fYXpOmNXJ.YxCVqzTf4E3zBpcHEZ8qHQUTsMTWuam', 'System', 'Administrator', true);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'admin' AND r.name = 'ADMIN';
