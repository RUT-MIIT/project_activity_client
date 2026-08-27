import type { IStudentStore } from './types';

import { createSlice } from '@reduxjs/toolkit';

import * as actions from './actions';

const initialState: IStudentStore = {
	group: null,
	lobby: null,
	myTeam: null,
	eventLog: null,
	isLoadingGroup: false,
	isLoadingAction: false,
	isLoadingLobby: false,
	isLoadingMyTeam: false,
	isMyTeamLoaded: false,
	isLoadingEventLog: false,
	error: null,
};

export const studentSlice = createSlice({
	name: 'student',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(actions.getMyGroupAction.pending, (state) => {
				state.isLoadingGroup = true;
				state.error = null;
			})
			.addCase(actions.getMyGroupAction.fulfilled, (state, action) => {
				state.isLoadingGroup = false;
				state.group = action.payload;
			})
			.addCase(actions.getMyGroupAction.rejected, (state, action) => {
				state.isLoadingGroup = false;
				state.error = action.error?.message || 'Не удалось загрузить группу';
			})
			.addCase(actions.getMyTeamAction.pending, (state) => {
				state.isLoadingMyTeam = true;
				state.isMyTeamLoaded = false;
				state.error = null;
			})
			.addCase(actions.getMyTeamAction.fulfilled, (state, action) => {
				state.isLoadingMyTeam = false;
				state.isMyTeamLoaded = true;
				state.myTeam = action.payload;
			})
			.addCase(actions.getMyTeamAction.rejected, (state, action) => {
				state.isLoadingMyTeam = false;
				state.isMyTeamLoaded = true;
				state.error = action.error?.message || 'Не удалось загрузить данные';
			})
			.addCase(actions.getTeamLobbyAction.pending, (state) => {
				state.isLoadingLobby = true;
				state.error = null;
			})
			.addCase(actions.getTeamLobbyAction.fulfilled, (state, action) => {
				state.isLoadingLobby = false;
				state.lobby = action.payload;
			})
			.addCase(actions.getTeamLobbyAction.rejected, (state, action) => {
				state.isLoadingLobby = false;
				state.error = action.error?.message || 'Не удалось загрузить данные';
			})
			.addCase(actions.createTeamAction.pending, (state) => {
				state.isLoadingGroup = true;
				state.error = null;
			})
			.addCase(actions.createTeamAction.fulfilled, (state, action) => {
				state.isLoadingGroup = false;
				if (state.lobby) {
					state.lobby.myTeam = action.payload;
				}
			})
			.addCase(actions.createTeamAction.rejected, (state, action) => {
				state.isLoadingGroup = false;
				state.error = action.error?.message || 'Не удалось создать команду';
			})
			.addCase(actions.deleteMyTeamAction.pending, (state) => {
				state.isLoadingAction = true;
				state.error = null;
			})
			.addCase(actions.deleteMyTeamAction.fulfilled, (state) => {
				state.isLoadingAction = false;
				if (state.lobby) {
					state.lobby.myTeam = null;
				}
			})
			.addCase(actions.deleteMyTeamAction.rejected, (state, action) => {
				state.isLoadingAction = false;
				state.error = action.error?.message || 'Не удалось удалить команду';
			})
			.addCase(actions.createTeamInvitationAction.pending, (state) => {
				state.isLoadingAction = true;
				state.error = null;
			})
			.addCase(actions.createTeamInvitationAction.fulfilled, (state) => {
				state.isLoadingAction = false;
			})
			.addCase(actions.createTeamInvitationAction.rejected, (state, action) => {
				state.isLoadingAction = false;
				state.error =
					action.error?.message || 'Не удалось отправить приглашение';
			})
			.addCase(actions.acceptTeamInvitationAction.pending, (state) => {
				state.isLoadingAction = true;
				state.error = null;
			})
			.addCase(
				actions.acceptTeamInvitationAction.fulfilled,
				(state, action) => {
					state.isLoadingAction = false;
					state.myTeam = action.payload;
				}
			)
			.addCase(actions.acceptTeamInvitationAction.rejected, (state, action) => {
				state.isLoadingAction = false;
				state.error = action.error?.message || 'Не удалось принять приглашение';
			})

			.addCase(actions.rejectTeamInvitationAction.pending, (state) => {
				state.isLoadingAction = true;
				state.error = null;
			})
			.addCase(
				actions.rejectTeamInvitationAction.fulfilled,
				(state, action) => {
					state.isLoadingAction = false;

					if (state.lobby) {
						state.lobby.invitations = state.lobby.invitations.filter(
							(invitation) => invitation.id !== action.payload.id
						);
					}
				}
			)
			.addCase(actions.rejectTeamInvitationAction.rejected, (state, action) => {
				state.isLoadingAction = false;
				state.error =
					action.error?.message || 'Не удалось отклонить приглашение';
			})
			.addCase(actions.deleteTeamMemberAction.pending, (state) => {
				state.isLoadingAction = true;
				state.error = null;
			})
			.addCase(actions.deleteTeamMemberAction.fulfilled, (state, action) => {
				state.isLoadingAction = false;
				state.myTeam = action.payload;
			})
			.addCase(actions.deleteTeamMemberAction.rejected, (state, action) => {
				state.isLoadingAction = false;
				state.error = action.error?.message || 'Не удалось удалить участника';
			})
			.addCase(actions.leaveMyTeamAction.pending, (state) => {
				state.isLoadingAction = true;
				state.error = null;
			})
			.addCase(actions.leaveMyTeamAction.fulfilled, (state) => {
				state.isLoadingAction = false;
				state.myTeam = null;
			})
			.addCase(actions.leaveMyTeamAction.rejected, (state, action) => {
				state.isLoadingAction = false;
				state.error = action.error?.message || 'Не удалось покинуть команду';
			})
			.addCase(actions.getMyTeamEventLogAction.pending, (state) => {
				state.isLoadingEventLog = true;
			})
			.addCase(actions.getMyTeamEventLogAction.fulfilled, (state, action) => {
				state.isLoadingEventLog = false;
				state.eventLog = action.payload;
			})

			.addCase(actions.getMyTeamEventLogAction.rejected, (state) => {
				state.isLoadingEventLog = false;
				state.eventLog = null;
			});
	},
});
