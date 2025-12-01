export interface ICreateAppForm {
	author_lastname: string;
	author_firstname: string;
	author_middlename: string;
	author_email: string;
	author_phone: string;
	author_role: { id: number; name: string };
	author_division: string;

	company_type: { id: number; name: string };
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
	title: string;
	additional_materials: string;
	needs_consultation: boolean;
}
