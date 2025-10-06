-- Migration: Voeg voorraad en ophaaltijden toe
-- Voer dit uit als je al een bestaande database hebt

-- 1. Voeg stock_quantity toe aan items tabel
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 1;

-- Update bestaande items naar minimaal 1 voorraad
UPDATE items SET stock_quantity = 1 WHERE stock_quantity IS NULL OR stock_quantity < 1;

-- 2. Voeg ophaaltijd en beschikbaarheidstijd toe aan settings
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS pickup_time TIME DEFAULT '12:00',
ADD COLUMN IF NOT EXISTS available_after_pickup_hours INTEGER DEFAULT 3;

-- Update bestaande settings row met standaard waarden
UPDATE settings
SET pickup_time = '12:00',
    available_after_pickup_hours = 3
WHERE pickup_time IS NULL;

-- 3. Voeg comment toe voor duidelijkheid
COMMENT ON COLUMN items.stock_quantity IS 'Aantal beschikbare exemplaren van dit artikel';
COMMENT ON COLUMN settings.pickup_time IS 'Tijd waarop items de dag na boeking worden opgehaald';
COMMENT ON COLUMN settings.available_after_pickup_hours IS 'Aantal uren na ophalen voordat item weer beschikbaar is';

-- Klaar! De database is nu bijgewerkt.

