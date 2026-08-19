export interface IUserStore {
	user: IUser | null;
	isAuthChecked: boolean;
	isLoading: boolean;
	isLoadingRequest: boolean;
	error: string | null;
}

export interface ILoginRequest {
	email: string;
	password: string;
}

export interface IRegistrationRequest {
	first_name: string;
	last_name: string;
	middle_name: string;
	email: string;
	phone: string;
	comment: string;
	department: number;
}

export interface IAuthResponse {
	access: string;
	refresh: string;
	user: IUser;
}

export interface IUser {
	id: number;
	email: string;
	first_name: string;
	last_name: string;
	middle_name: string;
	role: string;
	phone: string;
	department: {
		id: number;
		name: string;
		short_name: string;
	};
	institute_code: string | null;
}

export interface IPreRegisteredStudent {
	id: number;
	last_name: string;
	first_name: string;
	middle_name: string;
	group_name: string;
	student_card: string;
	is_registered: boolean;
}

export type IPreRegistrationLookupRequest =
	| {
			student_card: string;
	  }
	| {
			personnel_number: string;
	  }
	| {
			snils: string;
	  };

export interface IStudentRegistrationRequest {
	id: number;
	email: string;
	password: string;
}

export interface ITokenRequest {
	token: string;
}

export interface IMessageResponse {
	id?: number;
	message: string;
}
