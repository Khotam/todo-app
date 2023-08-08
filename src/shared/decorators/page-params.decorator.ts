import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { DEFAULT_PAGE_SIZE, LIMIT_PARAM_NAME, OFFSET_PARAM_NAME } from '../constants';
import { PageParams } from '../models';

interface PageParamsOptions {
  default: number;
}

/**
 * Params for pagination
 */
export const Page = createParamDecorator((_data: PageParamsOptions, ctx: ExecutionContext): PageParams => {
  const request = ctx.switchToHttp().getRequest();
  return {
    limit: request.query[LIMIT_PARAM_NAME]
      ? parseInt(request.query[LIMIT_PARAM_NAME])
      : _data?.default ?? DEFAULT_PAGE_SIZE,
    offset: request.query[OFFSET_PARAM_NAME] ? parseInt(request.query[OFFSET_PARAM_NAME]) : 0,
  };
});
