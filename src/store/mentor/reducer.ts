import type { IMentorStore, IMentorTeam } from './types';

import { createSlice } from '@reduxjs/toolkit';

import * as actions from './actions';

const initialState: IMentorStore = {
	groups: [],
	currentGroup: null,

	showcase: [],
	showcaseDetail: null,

	currentTeam: null,

	isLoadingGroups: false,
	isLoadingGroupDetail: false,
	isLoadingShowcase: false,
	isLoadingShowcaseDetail: false,
	isLoadingTeam: false,
	isLoadingTeamRequest: false,

	error: null,
};

/**
 * Синхронизация команды:
 * - currentTeam — полная карточка команды;
 * - currentGroup.teams — краткая информация для списка команд;
 * - currentGroup.students — актуальный состав команды у студентов.
 */
const updateTeamInCurrentGroup = (state: IMentorStore, team: IMentorTeam) => {
	state.currentTeam = team;

	if (!state.currentGroup) {
		return;
	}

	/* =========================
	 * Обновляем карточку команды
	 * ========================= */

	state.currentGroup.teams = state.currentGroup.teams.map((item) =>
		item.id === team.id
			? {
					...item,
					name: team.name,
					status: team.status,
					membersCount: team.membersCount,
			  }
			: item
	);

	/* =========================
	 * Обновляем состав студентов
	 * ========================= */

	const teamMembersMap = new Map(
		team.members.map((member) => [member.userId, member])
	);

	state.currentGroup.students = state.currentGroup.students.map((student) => {
		if (student.userId === null) {
			return student;
		}

		/**
		 * Студент сейчас состоит в этой команде.
		 */
		const teamMember = teamMembersMap.get(student.userId);

		if (teamMember) {
			return {
				...student,
				team: {
					id: team.id,
					name: team.name,
					role: teamMember.role,
				},
			};
		}

		/**
		 * Студент раньше состоял в этой команде,
		 * но после мутации был из неё удалён.
		 */
		if (student.team?.id === team.id) {
			return {
				...student,
				team: null,
			};
		}

		return student;
	});
};

export const mentorSlice = createSlice({
	name: 'mentor',

	initialState,

	reducers: {
		clearError(state) {
			state.error = null;
		},

		clearCurrentGroup(state) {
			state.currentGroup = null;
			state.currentTeam = null;
		},

		clearShowcase(state) {
			state.showcase = [];
		},

		clearShowcaseDetail(state) {
			state.showcaseDetail = null;
		},

		clearCurrentTeam(state) {
			state.currentTeam = null;
		},
	},

	extraReducers: (builder) => {
		builder

			/* =========================
			 * Мои группы
			 * ========================= */

			.addCase(actions.getMyGroupsAction.pending, (state) => {
				state.isLoadingGroups = true;
				state.error = null;
			})

			.addCase(actions.getMyGroupsAction.fulfilled, (state, action) => {
				state.isLoadingGroups = false;
				state.groups = action.payload;
			})

			.addCase(actions.getMyGroupsAction.rejected, (state, action) => {
				state.isLoadingGroups = false;
				state.error = action.error?.message || 'Не удалось загрузить группы';
			})

			/* =========================
			 * Детали группы
			 * ========================= */

			.addCase(actions.getMyGroupDetailAction.pending, (state) => {
				state.isLoadingGroupDetail = true;
				state.error = null;
			})

			.addCase(actions.getMyGroupDetailAction.fulfilled, (state, action) => {
				state.isLoadingGroupDetail = false;
				state.currentGroup = action.payload;
				state.currentTeam = null;
			})

			.addCase(actions.getMyGroupDetailAction.rejected, (state, action) => {
				state.isLoadingGroupDetail = false;
				state.error =
					action.error?.message || 'Не удалось загрузить информацию о группе';
			})

			/* =========================
			 * Витрина проектов группы
			 * ========================= */

			.addCase(actions.getMyGroupShowcaseAction.pending, (state) => {
				state.isLoadingShowcase = true;
				state.error = null;
			})

			.addCase(actions.getMyGroupShowcaseAction.fulfilled, (state, action) => {
				state.isLoadingShowcase = false;
				state.showcase = action.payload;
			})

			.addCase(actions.getMyGroupShowcaseAction.rejected, (state, action) => {
				state.isLoadingShowcase = false;
				state.error =
					action.error?.message || 'Не удалось загрузить витрину проектов';
			})

			/* =========================
			 * Детали проекта
			 * ========================= */

			.addCase(actions.getMyGroupShowcaseDetailAction.pending, (state) => {
				state.isLoadingShowcaseDetail = true;
				state.error = null;
			})

			.addCase(
				actions.getMyGroupShowcaseDetailAction.fulfilled,
				(state, action) => {
					state.isLoadingShowcaseDetail = false;
					state.showcaseDetail = action.payload;
				}
			)

			.addCase(
				actions.getMyGroupShowcaseDetailAction.rejected,
				(state, action) => {
					state.isLoadingShowcaseDetail = false;
					state.error =
						action.error?.message ||
						'Не удалось загрузить информацию о проекте';
				}
			)

			/* =========================
			 * Получение конкретной команды
			 * ========================= */

			.addCase(actions.getMentorTeamAction.pending, (state) => {
				state.isLoadingTeam = true;
				state.error = null;
			})

			.addCase(actions.getMentorTeamAction.fulfilled, (state, action) => {
				state.isLoadingTeam = false;

				updateTeamInCurrentGroup(state, action.payload);
			})

			.addCase(actions.getMentorTeamAction.rejected, (state, action) => {
				state.isLoadingTeam = false;
				state.error =
					action.error?.message || 'Не удалось загрузить информацию о команде';
			})

			/* =========================
			 * Переименование команды
			 * ========================= */

			.addCase(actions.updateMentorTeamNameAction.pending, (state) => {
				state.isLoadingTeamRequest = true;
				state.error = null;
			})

			.addCase(
				actions.updateMentorTeamNameAction.fulfilled,
				(state, action) => {
					state.isLoadingTeamRequest = false;

					updateTeamInCurrentGroup(state, action.payload);
				}
			)

			.addCase(actions.updateMentorTeamNameAction.rejected, (state, action) => {
				state.isLoadingTeamRequest = false;
				state.error =
					action.error?.message || 'Не удалось переименовать команду';
			})

			/* =========================
			 * Назначение капитана
			 * ========================= */

			.addCase(actions.updateMentorTeamCaptainAction.pending, (state) => {
				state.isLoadingTeamRequest = true;
				state.error = null;
			})

			.addCase(
				actions.updateMentorTeamCaptainAction.fulfilled,
				(state, action) => {
					state.isLoadingTeamRequest = false;

					updateTeamInCurrentGroup(state, action.payload);
				}
			)

			.addCase(
				actions.updateMentorTeamCaptainAction.rejected,
				(state, action) => {
					state.isLoadingTeamRequest = false;
					state.error =
						action.error?.message || 'Не удалось назначить капитана';
				}
			)

			/* =========================
			 * Подтверждение состава
			 * ========================= */

			.addCase(actions.confirmMentorTeamCompositionAction.pending, (state) => {
				state.isLoadingTeamRequest = true;
				state.error = null;
			})

			.addCase(
				actions.confirmMentorTeamCompositionAction.fulfilled,
				(state, action) => {
					state.isLoadingTeamRequest = false;

					updateTeamInCurrentGroup(state, action.payload);
				}
			)

			.addCase(
				actions.confirmMentorTeamCompositionAction.rejected,
				(state, action) => {
					state.isLoadingTeamRequest = false;
					state.error =
						action.error?.message || 'Не удалось подтвердить состав команды';
				}
			)

			/* =========================
			 * Возврат состава на редактирование
			 * ========================= */

			.addCase(
				actions.unconfirmMentorTeamCompositionAction.pending,
				(state) => {
					state.isLoadingTeamRequest = true;
					state.error = null;
				}
			)

			.addCase(
				actions.unconfirmMentorTeamCompositionAction.fulfilled,
				(state, action) => {
					state.isLoadingTeamRequest = false;

					updateTeamInCurrentGroup(state, action.payload);
				}
			)

			.addCase(
				actions.unconfirmMentorTeamCompositionAction.rejected,
				(state, action) => {
					state.isLoadingTeamRequest = false;
					state.error =
						action.error?.message ||
						'Не удалось вернуть состав на редактирование';
				}
			)

			/* =========================
			 * Добавление участника
			 * ========================= */

			.addCase(actions.addMentorTeamMemberAction.pending, (state) => {
				state.isLoadingTeamRequest = true;
				state.error = null;
			})

			.addCase(actions.addMentorTeamMemberAction.fulfilled, (state, action) => {
				state.isLoadingTeamRequest = false;

				updateTeamInCurrentGroup(state, action.payload);
			})

			.addCase(actions.addMentorTeamMemberAction.rejected, (state, action) => {
				state.isLoadingTeamRequest = false;
				state.error = action.error?.message || 'Не удалось добавить участника';
			})

			/* =========================
			 * Удаление участника
			 * ========================= */

			.addCase(actions.removeMentorTeamMemberAction.pending, (state) => {
				state.isLoadingTeamRequest = true;
				state.error = null;
			})

			.addCase(
				actions.removeMentorTeamMemberAction.fulfilled,
				(state, action) => {
					state.isLoadingTeamRequest = false;

					updateTeamInCurrentGroup(state, action.payload);
				}
			)

			.addCase(
				actions.removeMentorTeamMemberAction.rejected,
				(state, action) => {
					state.isLoadingTeamRequest = false;
					state.error = action.error?.message || 'Не удалось удалить участника';
				}
			)

			/* =========================
			 * Удаление команды
			 * ========================= */

			.addCase(actions.deleteMentorTeamAction.pending, (state) => {
				state.isLoadingTeamRequest = true;
				state.error = null;
			})

			.addCase(actions.deleteMentorTeamAction.fulfilled, (state, action) => {
				state.isLoadingTeamRequest = false;
				state.currentTeam = null;

				if (!state.currentGroup) {
					return;
				}

				const teamId = action.meta.arg.teamSemesterId;

				/* Убираем команду из списка */
				state.currentGroup.teams = state.currentGroup.teams.filter(
					(team) => team.id !== teamId
				);

				/* Освобождаем студентов этой команды */
				state.currentGroup.students = state.currentGroup.students.map(
					(student) => {
						if (student.team?.id !== teamId) {
							return student;
						}

						return {
							...student,
							team: null,
						};
					}
				);
			})

			.addCase(actions.deleteMentorTeamAction.rejected, (state, action) => {
				state.isLoadingTeamRequest = false;
				state.error = action.error?.message || 'Не удалось удалить команду';
			});
	},
});

export const {
	clearError,
	clearCurrentGroup,
	clearShowcase,
	clearShowcaseDetail,
	clearCurrentTeam,
} = mentorSlice.actions;

export default mentorSlice.reducer;
