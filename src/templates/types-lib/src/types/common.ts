/**
 * 通用ID类型
 */
export type ID = string | number;

/**
 * 分页参数
 */
export interface PaginationParams {
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
}

/**
 * 分页结果
 */
export interface PaginationResult<T> {
  /** 数据列表 */
  list: T[];
  /** 总数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
}

/**
 * 排序方向
 */
export type SortDirection = 'asc' | 'desc';

/**
 * 排序参数
 */
export interface SortParams {
  /** 排序字段 */
  field: string;
  /** 排序方向 */
  direction: SortDirection;
}

/**
 * 通用响应结构
 */
export interface ResponseData<T> {
  /** 响应状态码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data: T;
  /** 是否成功 */
  success: boolean;
} 