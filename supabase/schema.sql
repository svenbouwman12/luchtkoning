-- LuchtKoning Database Schema
-- Voer dit script uit in de Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Items table (verhuurartikelen)
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price_per_day NUMERIC(10, 2) NOT NULL,
    category TEXT NOT NULL,
    available BOOLEAN DEFAULT true,
    image_url TEXT,
    stock_quantity INTEGER DEFAULT 1,  -- Aantal beschikbare exemplaren
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table (klanten)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    address TEXT,
    total_spent NUMERIC(10, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table (boekingen)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME NOT NULL DEFAULT '09:00',
    end_time TIME NOT NULL DEFAULT '17:00',
    total_price NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'in behandeling',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booking items junction table (koppeltabel voor geboekte items)
CREATE TABLE booking_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table (algemene instellingen)
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT DEFAULT 'LuchtKoning',
    company_email TEXT,
    company_phone TEXT,
    company_address TEXT,
    vat_percentage NUMERIC(5, 2) DEFAULT 21.00,
    currency TEXT DEFAULT 'EUR',
    -- Werkdagen configuratie (JSON array: [1,2,3,4,5,6,0] waarbij 0=zondag, 1=maandag, etc.)
    working_days JSONB DEFAULT '[1,2,3,4,5,6]'::jsonb,
    -- Tijdslots configuratie (JSON array van tijden: ["09:00", "10:00", "11:00", etc.])
    time_slots JSONB DEFAULT '["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"]'::jsonb,
    -- Standaard boekingsduur in uren
    default_booking_duration INTEGER DEFAULT 4,
    -- Ophaaltijd (wanneer items worden opgehaald de dag na einde boeking)
    pickup_time TIME DEFAULT '12:00',
    -- Beschikbaar vanaf tijd (na ophalen en schoonmaken)
    available_after_pickup_hours INTEGER DEFAULT 3,  -- Aantal uren na ophalen
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (company_name, company_email, company_phone, vat_percentage, working_days, time_slots)
VALUES ('LuchtKoning', 'info@luchtkoning.nl', '+31 6 12345678', 21.00, 
        '[1,2,3,4,5,6]'::jsonb, 
        '["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"]'::jsonb);

-- Indexes voor betere performance
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX idx_bookings_datetime ON bookings(start_date, start_time, end_date, end_time);
CREATE INDEX idx_booking_items_booking ON booking_items(booking_id);
CREATE INDEX idx_booking_items_item ON booking_items(item_id);

-- Trigger om updated_at automatisch bij te werken
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function om total_spent van klant bij te werken
CREATE OR REPLACE FUNCTION update_customer_total_spent()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE customers
    SET total_spent = (
        SELECT COALESCE(SUM(total_price), 0)
        FROM bookings
        WHERE customer_id = NEW.customer_id
        AND status = 'bevestigd'
    )
    WHERE id = NEW.customer_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customer_spent_on_booking AFTER INSERT OR UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_customer_total_spent();

-- Sample data (optioneel, voor testen)
INSERT INTO items (name, description, price_per_day, category, stock_quantity, image_url) VALUES
    ('Grote Springkussen', 'Kleurrijk springkussen 4x4 meter, geschikt voor kinderen tot 12 jaar', 75.00, 'Springkussens', 1, 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?w=400'),
    ('Kleine Springkussen', 'Compact springkussen 3x3 meter, ideaal voor kleinere ruimtes', 50.00, 'Springkussens', 2, 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400'),
    ('Feesttent 6x3m', 'Witte feesttent met zijwanden, geschikt voor 30 personen', 125.00, 'Feesttenten', 1, 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400'),
    ('Feesttent 8x4m', 'Grote feesttent met zijwanden, geschikt voor 50 personen', 175.00, 'Feesttenten', 1, 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400'),
    ('Partytafel', 'Inklapbare partytafel 180x80cm', 15.00, 'Meubilair', 10, 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400'),
    ('Partystoel', 'Klapstoelen, beschikbaar per 10 stuks', 2.50, 'Meubilair', 100, 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400');

-- Row Level Security (RLS) - optioneel voor later
-- ALTER TABLE items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;

-- Public read access for items (klanten kunnen items zien)
-- CREATE POLICY "Items are viewable by everyone" ON items FOR SELECT USING (true);

-- TODO: Later auth policies toevoegen voor admin functies

