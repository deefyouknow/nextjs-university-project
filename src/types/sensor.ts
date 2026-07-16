export interface SensorLog {
  id: number;
  timestamp_slot: string; // ISO 8601 timestamp
  lux_l: number | null;
  lux_ml: number | null;
  lux_mr: number | null;
  lux_r: number | null;
  lux_panel_left: number | null;
  lux_panel_right: number | null;
  voltage: number | null;
  current: number | null;
  power: number | null;
  is_online: boolean;
}

export interface SensorHistoryResponse {
  readings: SensorLog[];
  count: number;
}
