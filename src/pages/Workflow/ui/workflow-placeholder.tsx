import type { FC } from 'react';

import { Notice } from '../../../shared/components/Notice/ui/notice';

interface IWorkflowPlaceholderProps {
	title: string;
	text: string;
}

export const WorkflowPlaceholder: FC<IWorkflowPlaceholderProps> = ({
	title,
	text,
}) => {
	return <Notice type='info' title={title} text={text} />;
};
