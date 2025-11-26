import {inject} from '@loopback/core';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import {AuthenticateFn, AuthenticationBindings} from '@loopback/authentication';

export class MySequence implements SequenceHandler {
  constructor(
    @inject(RestBindings.SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(RestBindings.SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(RestBindings.SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(RestBindings.SequenceActions.SEND) public send: Send,
    @inject(RestBindings.SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION) protected authenticateRequest: AuthenticateFn,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;

      // CORS headers
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (request.method === 'OPTIONS') {
        response.statusCode = 204;
        response.end();
        return;
      }

      const route = this.findRoute(request);
      await this.authenticateRequest(request);
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}
