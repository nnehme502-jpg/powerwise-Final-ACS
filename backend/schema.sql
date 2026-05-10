CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(30) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS devices (
  id SERIAL PRIMARY KEY,
  room_id INT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  power_rating_watts NUMERIC NOT NULL CHECK(power_rating_watts > 0),
  device_type VARCHAR(50) NOT NULL CHECK(
    device_type IN (
      'heater',
      'air_conditioner',
      'washing_machine',
      'dryer',
      'refrigerator',
      'oven',
      'dishwasher',
      'television',
      'computer',
      'router',
      'lighting',
      'fan',
      'water_heater',
      'microwave',
      'vacuum',
      'other'
    )
  ),
  status VARCHAR(30) DEFAULT 'inactive' CHECK(
    status IN ('active', 'inactive', 'maintenance', 'off')
  ),
  avg_daily_usage_hours NUMERIC DEFAULT 0,
  energy_threshold_kwh NUMERIC DEFAULT 3,
  cost_threshold NUMERIC DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS energy_logs (
  id SERIAL PRIMARY KEY,
  device_id INT NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  hours_used NUMERIC NOT NULL,
  energy_kwh NUMERIC NOT NULL,
  estimated_cost NUMERIC NOT NULL,
  logged_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id INT REFERENCES devices(id) ON DELETE CASCADE,
  alert_type VARCHAR(60) NOT NULL DEFAULT 'general',
  severity VARCHAR(20) NOT NULL DEFAULT 'medium',
  title VARCHAR(160),
  message TEXT,
  threshold_metric VARCHAR(80),
  threshold_value NUMERIC,
  actual_value NUMERIC,
  type VARCHAR(30) DEFAULT 'warning',
  is_read BOOLEAN DEFAULT false,
  triggered_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rooms_user_id ON rooms(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_room_id ON devices(room_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_device_id ON alerts(device_id);
CREATE INDEX IF NOT EXISTS idx_energy_logs_device_id ON energy_logs(device_id);