export type CommandStatus = 0 | 1 | 2; // 0=Waiting, 1=Success, 2=Failed/Interrupt

export interface Command {
  id: number;
  created_at: string;
  completed_at: string | null;
  function_name: string;
  from_user: string;
  target_type: string;
  target_value: number | null;
  target_left_ratio: number | null;
  target_right_ratio: number | null;
  tolerance: number;
  lux_left: number | null;
  lux_right: number | null;
  status: CommandStatus;
}

export interface CommandListResponse {
  commands: Command[];
  count: number;
}

export interface CommandResponse {
  id: number;
  created_at: string;
  status: CommandStatus;
}

export interface CreateCommandRequest {
  from_user: string;
  target_type: string;
  target_value?: number;
  target_left_ratio?: number;
  target_right_ratio?: number;
  tolerance: number;
}
