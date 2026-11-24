-- =========================================================
--  Script SQL de usuarios y roles probados
--  Usa SOLO los roles del enunciado: admin y supervisor
--  (los crea la migración SeedAdmin).
--
--  Ejecutar con (PowerShell), con la API ya arrancada al menos
--  una vez (las migraciones crean las tablas, los roles y el admin):
--  Get-Content db/pruebas.sql | docker exec -i parcial_2_db psql -U parcial2 -d parcial_2_db
-- =========================================================

BEGIN;

-- ---------------------------------------------------------
-- 1. Usuarios de prueba
-- ---------------------------------------------------------
INSERT INTO users (email, password, name, phone, is_active) VALUES
  ('laura.gomez@test.com',   '$scrypt$ln=17,r=8,p=1$xqFzdkT7JiUBBP6otvzf+w$bLTp3yR7tyrOGXm3t3hB4Il/lqKPxxo0MtBN0ft+wkU', 'Laura Gómez',   '3001234567', TRUE),
  ('carlos.perez@test.com',  '$scrypt$ln=17,r=8,p=1$rx3O7N1DXtFqvJ3AXVZMtg$Nlb3wBmMbJWGNliZeMLr+dWZjpzDafXgaHDrZZcPozE', 'Carlos Pérez',  '3007654321', TRUE),
  ('andrea.ruiz@test.com',   '$scrypt$ln=17,r=8,p=1$KKvcmt1Q6WpMlDovPwjkiw$Lp2aUBphZKnq3tgKo8bqPkXB2+We+JOI9hVcFUvvEGA', 'Andrea Ruiz',   '3109876543', TRUE),
  ('juan.martinez@test.com', '$scrypt$ln=17,r=8,p=1$Ilz38/f486SEhL3Qy1EKvQ$2J8l4oMvyPG5G1Uh6P3t0okv1HZcomKWbxrwHQZYMnI', 'Juan Martínez', NULL,         TRUE),
  ('sofia.lopez@test.com',   '$scrypt$ln=17,r=8,p=1$5Dec5ZO8GDlV4hS8LVrAMA$Nll8Kwi/Gcf6ahUmKiHgElL+lhWHFbj/qCCo+bJfv+s', 'Sofía López',   NULL,         FALSE)
ON CONFLICT (email) DO NOTHING;

-- ---------------------------------------------------------
-- 2. Asignación de roles (muchos a muchos: user_roles)
--    Laura Gómez   -> admin
--    Carlos Pérez  -> supervisor
--    Andrea Ruiz   -> admin + supervisor  (como el body del enunciado:
--                     { roles: ["admin","supervisor"] })
--    Juan Martínez -> (sin roles: como queda al registrarse)
--    Sofía López   -> supervisor, pero DESACTIVADA (login debe dar 423)
-- ---------------------------------------------------------
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM (VALUES
  ('laura.gomez@test.com',  'admin'),
  ('carlos.perez@test.com', 'supervisor'),
  ('andrea.ruiz@test.com',  'admin'),
  ('andrea.ruiz@test.com',  'supervisor'),
  ('sofia.lopez@test.com',  'supervisor')
) AS a(email, role_name)
JOIN users u ON u.email = a.email
JOIN roles r ON r.role_name = a.role_name
ON CONFLICT DO NOTHING;

COMMIT;

-- =========================================================
--  VERIFICACIONES
-- =========================================================

-- 3. Roles y cuántos usuarios tiene cada uno
SELECT r.role_name, r.description, COUNT(ur.user_id) AS usuarios
FROM roles r
LEFT JOIN user_roles ur ON ur.role_id = r.id
GROUP BY r.id
ORDER BY r.role_name;

-- 4. Usuarios con sus roles y si están activos
SELECT u.name, u.email, u.is_active,
       COALESCE(string_agg(r.role_name, ', ' ORDER BY r.role_name), '(sin roles)') AS roles
FROM users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN roles r ON r.id = ur.role_id
GROUP BY u.id
ORDER BY u.created_at;

-- 5. Ninguna contraseña está en texto plano (todas deben ser hash scrypt)
SELECT COUNT(*) AS total_usuarios,
       COUNT(*) FILTER (WHERE password LIKE '$scrypt$%') AS con_hash_scrypt
FROM users;

-- 6. Quiénes son admin (pasan todas las policies por before())
SELECT u.name, u.email
FROM users u
JOIN user_roles ur ON ur.user_id = u.id
JOIN roles r ON r.id = ur.role_id
WHERE r.role_name = 'admin';

-- 7. Migraciones ejecutadas por TypeORM
SELECT id, name FROM migrations ORDER BY id;