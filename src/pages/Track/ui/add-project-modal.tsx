import type { FC, FormEvent, ChangeEvent } from 'react';
import type {
	ITrack,
	IProject,
	ITrackProjectToAdd,
} from '../../../store/track/types';

import { useEffect, useMemo, useState } from 'react';

import { useSelector } from '../../../store/store';

import { Modal } from '../../../shared/components/Modal/ui/modal';
import { Button } from '../../../shared/components/Button/ui/button';
import { Form } from '../../../shared/components/Form/ui/form';
import {
	FormField,
	FormButtons,
	FormInputNumber,
} from '../../../shared/components/Form/components';
import { SelectWithSearch } from '../../../shared/components/Select/ui/select-with-search';
import { Text } from '../../../shared/components/Typography';

interface IAddProjectModalProps {
	isOpen: boolean;
	track: ITrack | null;
	onClose: () => void;
	onSubmit: (projects: ITrackProjectToAdd[]) => void;
}

export const AddProjectModal: FC<IAddProjectModalProps> = ({
	isOpen,
	track,
	onClose,
	onSubmit,
}) => {
	const { projects, isLoadingAction } = useSelector((state) => state.track);

	const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

	const [teamsCount, setTeamsCount] = useState<number | null>(3);
	const [teamsCountTouched, setTeamsCountTouched] = useState(false);

	const getTeamsCountError = () => {
		if (!teamsCountTouched) {
			return {
				isShow: false,
				text: '',
			};
		}

		if (teamsCount === null) {
			return {
				isShow: true,
				text: 'Обязательное поле',
			};
		}

		if (teamsCount < 1) {
			return {
				isShow: true,
				text: 'Минимальное количество команд — 1',
			};
		}

		if (teamsCount > 3) {
			return {
				isShow: true,
				text: 'Максимальное количество команд — 3',
			};
		}

		return {
			isShow: false,
			text: '',
		};
	};

	const availableProjects = useMemo(() => {
		const addedProjectIds = new Set(
			track?.applications.map((project) => project.id) ?? []
		);

		return projects.filter((project) => !addedProjectIds.has(project.id));
	}, [projects, track]);

	const teamSizeRange = useMemo(() => {
		const firstProject = track?.applications[0];

		return {
			min: firstProject?.minTeamMembers ?? 4,
			max: firstProject?.maxTeamMembers ?? 7,
		};
	}, [track]);

	const handleChooseProject = (project: IProject | null) => {
		setSelectedProject(project);
	};

	const handleTeamsCountChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		setTeamsCountTouched(true);

		if (value === '') {
			setTeamsCount(null);
			return;
		}

		setTeamsCount(Number(value));
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!selectedProject || !teamsCount) {
			return;
		}

		onSubmit([
			{
				id: selectedProject.id,
				teamsCount,
				minTeamMembers: teamSizeRange.min,
				maxTeamMembers: teamSizeRange.max,
			},
		]);
	};

	const handleClose = () => {
		setSelectedProject(null);
		setTeamsCount(3);
		setTeamsCountTouched(false);

		onClose();
	};

	const isSubmitBlocked =
		!selectedProject || teamsCount === null || teamsCount < 1 || teamsCount > 3;

	useEffect(() => {
		if (!isOpen) {
			setSelectedProject(null);
			setTeamsCount(3);
			setTeamsCountTouched(false);
		}
	}, [isOpen]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title='Добавление проекта'
			description='Выберите проект и укажите количество команд'>
			<Form
				name='add-project-modal-form'
				onSubmit={handleSubmit}
				formWidth='full'>
				{availableProjects.length > 0 ? (
					<>
						<FormField title='Проект*'>
							<SelectWithSearch<IProject>
								options={availableProjects}
								currentOption={selectedProject}
								onChooseOption={handleChooseProject}
								placeholder='Выберите проект'
								valueKey='id'
								labelKey='title'
							/>
						</FormField>

						<FormField
							title='Количество команд на проект*'
							fieldError={getTeamsCountError()}>
							<FormInputNumber
								name='project-teams'
								placeholder='Введите количество команд'
								value={teamsCount}
								onChange={handleTeamsCountChange}
							/>
						</FormField>
					</>
				) : (
					<Text text='Все доступные проекты уже добавлены в этот трек' />
				)}

				<FormButtons withMargin>
					<Button
						text='Отмена'
						type='button'
						color='cancel'
						onClick={handleClose}
					/>

					<Button
						text='Добавить'
						type='submit'
						color='blue'
						isBlock={isSubmitBlocked || isLoadingAction}
					/>
				</FormButtons>
			</Form>
		</Modal>
	);
};
