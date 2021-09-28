import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';

/**
 * /auth/info
 */

export interface OrganizerDelete extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'DELETE';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: null;
  };
  response: {
    status: 200;
    body: {
      data: null;
      meta: {
        message: 'Organizer deleted successfully';
      };
    };
  };
}

export const organizerDeleteFactory = (
  token: OrganizerDelete['request']['headers']['Authorization'],
  query: { organizer: string }
): OrganizerDelete => ({
  request: {
    route: apiRoutes.organizerDelete({ organizer: query.organizer }),
    method: 'DELETE',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
    body: null,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
