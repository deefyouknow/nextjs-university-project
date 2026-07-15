// Types matching Axum API: GET /sensors/latest and GET /sensors/history

export interface SensorReading {
  id: number;
  time: string; // ISO 8601 timestamp
  lux_left: number | null;
  lux_right: number | null;
  lux_l: number | null;
  lux_ml: number | null;
  lux_mr: number | null;
  lux_r: number | null;
  ina_voltage: number | null;   // millivolts
  ina_current: number | null;   // milliamps
  ina_power: number | null;     // milliwatts
  limit_sw_left: boolean | null;
  limit_sw_right: boolean | null;
}

export interface SensorHistoryResponse {
  readings: SensorReading[];
  count: number;
}
