import * as Sentry from '@sentry/react';

const initSentry = () => {
    Sentry.init({
        // If this value is not provided, the SDK will try to read it from the SENTRY_DSN environment variable.
        // If that variable also does not exist, the SDK will just not send any events.
        // PHP/Drupal sentry is using the SENTRY_DSN on PLATTA.
        // if you need to test this locally, check SENTRY_DSN_REACT test enviroment value from Azure.
        dsn: drupalSettings?.paatokset_search?.sentry_dsn_react,
        // Setting ensures that 100% of transactions will be sent to Sentry, if it's too much it should be lowered.
        tracesSampleRate: 1.0,
    });
};

export default initSentry;
