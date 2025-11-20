export interface IHistoryStore {
	logs: ILog[];
	isLoadingLogs: boolean;
	error: string | null;
}

export interface ILog {
	id: number;
	from_status: string;
	to_status: string;
	changed_at: string;
	actor: string;
}
