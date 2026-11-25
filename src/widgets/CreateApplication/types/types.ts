import type {
	IProjectLevel,
	ICompanyType,
	IAuthorCategory,
	IApplicationKind,
} from '../../../shared/lib/lib';
import type { ITag } from '../../../store/catalog/types';

export interface ICreateAppForm {
	author_lastname: string;
	author_firstname: string;
	author_middlename: string;
	author_email: string;
	author_phone: string;
	author_role: IAuthorCategory;
	author_division: string;

	company_type: ICompanyType | null;
	application_kind: IApplicationKind | null;
	company: string;
	company_contacts: string;
	project_level: IProjectLevel | null;
	target_institutes: { code: string; name: string }[];

	problem_holder: string;
	goal: string;
	barrier: string;
	existing_solutions: string;
	case_description: string;

	context: string;
	recommended_tools: string;
	stakeholders: string;
	experts: string;

	tags: ITag | null;
	main_department: { id: number; name: string } | null;
	title: string;
	additional_materials: string;
	track_composer_comment: string;
	recommended_teams_count: number;
	needs_consultation: boolean;
	is_continuing: boolean;
	privacy_person: boolean;
	privacy_org: boolean;
}
