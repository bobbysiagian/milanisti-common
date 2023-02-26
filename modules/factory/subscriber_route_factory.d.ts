import { RequestHandler } from 'express';
import { EventSubscriber } from '../event';
declare const SubscriberRouteFactory: (subscriber: EventSubscriber) => RequestHandler;
export default SubscriberRouteFactory;
//# sourceMappingURL=subscriber_route_factory.d.ts.map