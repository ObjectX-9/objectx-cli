import { ID, PaginationParams, PaginationResult, ResponseData, SortParams } from './common';

/**
 * 用户基础信息
 */
export interface UserBase {
  /** 用户ID */
  id: ID;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname?: string;
  /** 头像 */
  avatar?: string;
  /** 邮箱 */
  email?: string;
}

/**
 * 用户详细信息
 */
export interface UserDetail extends UserBase {
  /** 角色列表 */
  roles: string[];
  /** 权限列表 */
  permissions: string[];
  /** 创建时间 */
  createdAt: string;
  /** 最后登录时间 */
  lastLoginAt?: string;
  /** 状态 */
  status: 'active' | 'inactive' | 'locked';
}

/**
 * 用户查询参数
 */
export interface UserQueryParams extends PaginationParams {
  /** 关键字搜索 */
  keyword?: string;
  /** 状态过滤 */
  status?: 'active' | 'inactive' | 'locked';
  /** 角色过滤 */
  role?: string;
  /** 排序 */
  sort?: SortParams;
}

/**
 * 用户查询结果
 */
export type UserQueryResult = PaginationResult<UserBase>;

/**
 * 用户API响应
 */
export type UserResponse = ResponseData<UserDetail>;
export type UserListResponse = ResponseData<UserQueryResult>; 