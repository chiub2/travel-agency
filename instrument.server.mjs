import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: 'https://bdf343bd16117886b9b8bfecf7ba48a6@o4509280166739968.ingest.us.sentry.io/4509280168837120',
  sendDefaultPii: true,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});
