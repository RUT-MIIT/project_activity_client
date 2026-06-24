import type { IApproveUser } from '../../../../../store/control/types';

export interface IUserDataProps {
	user: IApproveUser;
}

type TUserStatus = 'submitted' | 'approved' | 'rejected';

export interface IStatusOption {
	id: TUserStatus;
	name: string;
}
