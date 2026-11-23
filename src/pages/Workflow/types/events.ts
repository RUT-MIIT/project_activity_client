export type TEventType =
	| 'customer_meeting'
	| 'assessment'
	| 'checkpoint'
	| 'expert_pipe'
	| 'expertise'
	| 'defense';

export type TEventStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export type TEventFormat = 'offline' | 'online';

export type TEventsView = 'calendar' | 'timeline';

export interface IEventMaterial {
	name: string;
}

export interface IWorkflowEvent {
	id: number;
	type: TEventType;
	title: string;
	startAt: string;
	endAt?: string;
	status?: 'cancelled';
	description?: string;
	extra?: string;
	format?: TEventFormat;
	place?: string;
	meetingUrl?: string;
	assessmentKind?: string;
	resultRequirements?: string;
	criteria?: string;
	preparation?: string;
	materials?: IEventMaterial[];
	relatedModuleLabel?: string;
	relatedModulePath?: string;
}
