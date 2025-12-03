import type { PropsWithChildren } from 'react';
import type { IField } from '../../../store/application/types';

export interface IEditAppForm {
	author_lastname: string;
	author_firstname: string;
	author_middlename: string;
	author_email: string;
	author_phone: string;
	author_role: string;
	author_division: string;

	title: string;
	company: string;
	company_contacts: string;
	project_level: { id: number; name: string };
	target_institutes: { code: string; name: string }[];

	problem_holder: string;
	goal: string;
	barrier: string;
	existing_solutions: string;

	context: string;
	recommended_tools: string;
	stakeholders: string;
	experts: string;
	tags: { id: number; name: string };
	additional_materials: string;
}

export interface IApplicationFieldProps extends PropsWithChildren {
	title: string;
	fieldCode: string;
	currentField?: IField | null;
	getCommentCount: (fieldName: string) => number;
	onSelectField: (field: IField) => void;
}

export interface IEditApplicationProps {
	status: 'my-app' | 'external-app' | 'coordination';
}

export interface IDistributeApplicationProps {
	onDistribute: (code: string) => void;
}
