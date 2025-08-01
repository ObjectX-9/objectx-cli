import { expectType } from 'tsd';
import { 
  UserBase, 
  UserDetail, 
  UserQueryParams,
  UserQueryResult,
  UserResponse,
  UserListResponse
} from '../src';

// UserBase 类型测试
const userBase: UserBase = {
  id: '1',
  username: 'testuser',
  nickname: 'Test User',
  avatar: 'https://example.com/avatar.png',
  email: 'test@example.com'
};
expectType<UserBase>(userBase);

// UserDetail 类型测试
const userDetail: UserDetail = {
  id: '1',
  username: 'testuser',
  nickname: 'Test User',
  avatar: 'https://example.com/avatar.png',
  email: 'test@example.com',
  roles: ['admin'],
  permissions: ['read', 'write'],
  createdAt: '2023-01-01T00:00:00Z',
  lastLoginAt: '2023-01-02T00:00:00Z',
  status: 'active'
};
expectType<UserDetail>(userDetail);

// UserQueryParams 类型测试
const queryParams: UserQueryParams = {
  page: 1,
  pageSize: 10,
  keyword: 'test',
  status: 'active',
  role: 'admin',
  sort: {
    field: 'username',
    direction: 'asc'
  }
};
expectType<UserQueryParams>(queryParams);

// UserQueryResult 类型测试
const queryResult: UserQueryResult = {
  list: [userBase],
  total: 1,
  page: 1,
  pageSize: 10,
  totalPages: 1
};
expectType<UserQueryResult>(queryResult);

// UserResponse 类型测试
const userResponse: UserResponse = {
  code: 200,
  message: 'success',
  data: userDetail,
  success: true
};
expectType<UserResponse>(userResponse);

// UserListResponse 类型测试
const userListResponse: UserListResponse = {
  code: 200,
  message: 'success',
  data: queryResult,
  success: true
};
expectType<UserListResponse>(userListResponse); 