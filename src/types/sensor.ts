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
  roter_angle: number | null;
  limit_sw_left: boolean | null;
  limit_sw_right: boolean | null;
}

export interface SensorHistoryResponse {
  readings: SensorReading[];
  count: number;
}
