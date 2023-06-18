export const SELECT_WALLET = 'SEEDAO_WALLET';

export const SEEDAO_USER = 'SEEDAO_USER';
export const SEEDAO_USER_DATA = 'SEEDAO_USER_DATA';

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
  Project = 'proj',
  Guild = 'guild',
  ProjectAndGuild = 'proj_and_guild',

  ProjPrefix = 'proj_',
  GuildPrefix = 'guild_',
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
}

// ------ ------ ------ ------ ------ ------ ------ ------ ------
