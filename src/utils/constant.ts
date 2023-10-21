export const SEEDAO_ACCOUNT = 'SEEDAO_ACCOUNT';
export const SET_PROVIDER = 'SET_PROVIDER';
export const SELECT_WALLET = 'SEEDAO_WALLET';

export const SEEDAO_USER = 'SEEDAO_USER';
export const SEEDAO_USER_DATA = 'SEEDAO_USER_DATA';
export const SENDING_ME_USER = 'sdn_user_id';

// ------ ------ ------ ------ ------ ------ ------ ------ ------

/*
	(0x..., proj, create)
	(0x..., proj, close)

	(0x..., proj_and_guild, audit_app)

	(0x..., proj_1, modify)
	(0x..., proj_1, u_sponsor)
	(0x..., proj_1, u_member)
	(0x..., proj_1, u_budget)
	(0x..., proj_1, create_app)
*/

export enum PermissionObject {
  Treasury = 'treasury',
  Project = 'proj',
  Guild = 'guild',
  ProjectAndGuild = 'proj_and_guild',

  ProjPrefix = 'proj_',
  GuildPrefix = 'guild_',
  ObjEvent = 'event',
}

export enum PermissionAction {
  Create = 'create',
  Close = 'close',

  Modify = 'modify',
  UpdateSponsor = 'u_sponsor',
  UpdateMember = 'u_member',
  UpdateBudget = 'u_budget',
  CreateApplication = 'create_app',
  AuditApplication = 'audit_app',

  AssetsBudget = 'u_assert_budget',
  ActCreateEvent = 'create_event',
}

// ------ ------ ------ ------ ------ ------ ------ ------ ------

export const DefaultAvatar = '/icons/avatar.svg';

export enum AssetName {
  Credit = 'SCR',
  Token = 'USDT',
}

// CONTRACTS
// SGN
export const SGN_CONTRACT = '0x23fda8a873e9e46dbe51c78754dddccfbc41cfe1';
// SBT
// ethereum
export const GOV_NODE_CONTRACT = '0x9d34D407D8586478b3e4c39BE633ED3D7be1c80c';
// polygon
export const SBT_BOARDING = '0x0D9ea891B4C30e17437D00151399990ED7965F00';
