import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { ORDER_PARAM_NAME, SORT_PARAM_NAME, SortOrderEnum } from '../constants';
import { SortParams } from '../models';

/**
 * Sort parameters
 */
export const Sort = createParamDecorator((_data: unknown, ctx: ExecutionContext): SortParams | null => {
  const request = ctx.switchToHttp().getRequest();
  if (request.query[SORT_PARAM_NAME]) {
    return {
      sort: request.query[SORT_PARAM_NAME],
      order: request.query[ORDER_PARAM_NAME] ?? SortOrderEnum.DESC,
    };
  }
  return null;
});
