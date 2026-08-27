export type TeamStatus = 'forming' | 'confirmed';

export type TeamMemberRole =
	| 'captain'
	| 'participant'
	| 'analyst'
	| 'developer'
	| 'designer';

export interface ITeamMember {
	id: number;
	firstName: string;
	lastName: string;
	role: TeamMemberRole;
}

export interface IMockTeam {
	id: number;
	name: string;
	status: TeamStatus;
	minMembers: number;
	maxMembers: number;
	captain: ITeamMember;
	members: ITeamMember[];
	myRequestStatus: 'none' | 'pending';
}

export interface ITeamInvitation {
	id: number;
	teamId: number;
	teamName: string;
	captain: string;
	role: string;
}

export const mockTeams: IMockTeam[] = [
	{
		id: 1,
		name: 'Инноваторы',
		status: 'forming',
		minMembers: 4,
		maxMembers: 7,

		captain: {
			id: 1,
			firstName: 'Иван',
			lastName: 'Петров',
			role: 'captain',
		},

		members: [
			{
				id: 1,
				firstName: 'Иван',
				lastName: 'Петров',
				role: 'captain',
			},
			{
				id: 2,
				firstName: 'Анна',
				lastName: 'Смирнова',
				role: 'analyst',
			},
			{
				id: 3,
				firstName: 'Дмитрий',
				lastName: 'Иванов',
				role: 'developer',
			},
		],

		myRequestStatus: 'none',
	},

	{
		id: 2,
		name: 'Роботы будущего',
		status: 'forming',
		minMembers: 4,
		maxMembers: 7,

		captain: {
			id: 4,
			firstName: 'Алексей',
			lastName: 'Кузнецов',
			role: 'captain',
		},

		members: [
			{
				id: 4,
				firstName: 'Алексей',
				lastName: 'Кузнецов',
				role: 'captain',
			},
			{
				id: 5,
				firstName: 'Мария',
				lastName: 'Соколова',
				role: 'designer',
			},
			{
				id: 6,
				firstName: 'Сергей',
				lastName: 'Орлов',
				role: 'developer',
			},
		],

		myRequestStatus: 'pending',
	},

	{
		id: 3,
		name: 'Цифровая команда',
		status: 'forming',
		minMembers: 4,
		maxMembers: 7,

		captain: {
			id: 7,
			firstName: 'Екатерина',
			lastName: 'Морозова',
			role: 'captain',
		},

		members: [
			{
				id: 7,
				firstName: 'Екатерина',
				lastName: 'Морозова',
				role: 'captain',
			},
			{
				id: 8,
				firstName: 'Никита',
				lastName: 'Волков',
				role: 'developer',
			},
			{
				id: 9,
				firstName: 'Ольга',
				lastName: 'Фёдорова',
				role: 'analyst',
			},
			{
				id: 10,
				firstName: 'Максим',
				lastName: 'Попов',
				role: 'designer',
			},
		],

		myRequestStatus: 'none',
	},
];

export const mockInvitations: ITeamInvitation[] = [
	{
		id: 1,
		teamId: 1,
		teamName: 'Инноваторы',
		captain: 'Иван Петров',
		role: 'Дизайнер',
	},
];
