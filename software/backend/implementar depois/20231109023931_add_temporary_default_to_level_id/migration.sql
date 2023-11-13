// 20231109023931_add_temporary_default_to_level_id
-- AlterTable
ALTER TABLE "users" ADD COLUMN "level_id_temp" TEXT DEFAULT 'temporary_default_value';