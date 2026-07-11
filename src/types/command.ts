// Types matching Axum API: POST /commands, GET /commands/pending, GET /commands/history

export type CommandStatus = 'pending' | 'executing' | 'success' | 'failed';

export interface Command {
  id: number;
  created_at: string; // ISO 8601 timestamp
  source: string;     // 'manual' | 'algorithm'
  target_lux_l: number | null;
  target_lux_r: number | null;
  status: CommandStatus;
  executed_at: string | null;
  completed_at: string | null;
  lux_left: number | null;
  lux_right: number | null;
  response_note: string | null;
}

export interface CommandListResponse {
  commands: Command[];
  count: number;
}

export interface CommandResponse {
  id: number;
  created_at: string;
  source: string;
  target_lux_l: number | null;
  target_lux_r: number | null;
  status: CommandStatus;
}

export interface CreateCommandRequest {
  source?: string;
  target_lux_l?: number;
  target_lux_r?: number;
}
