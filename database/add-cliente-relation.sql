-- Script para adicionar relacionamento direto entre user e tbl_pessoa
-- Execute este SQL apenas se quiser abordagem com foreign key

-- Adicionar coluna cliente_id na tabela user
ALTER TABLE `user` ADD COLUMN `cliente_id` INT NULL;

-- Adicionar foreign key constraint (opcional)
-- ALTER TABLE `user` ADD CONSTRAINT `fk_user_cliente` 
-- FOREIGN KEY (`cliente_id`) REFERENCES `tbl_pessoa`(`id`) ON DELETE SET NULL;

-- Índice para performance
CREATE INDEX `idx_user_cliente_id` ON `user`(`cliente_id`);