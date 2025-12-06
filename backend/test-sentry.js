// Quick test script to verify Sentry connection
const Sentry = require('@sentry/node');

const sentryDsn = process.env.SENTRY_DSN || 'https://947448706a387985d28aba017e169e5f@o4510489151733760.ingest.us.sentry.io/4510489153044480';

console.log('Testing Sentry connection...');
console.log('DSN:', sentryDsn);

Sentry.init({
    dsn: sentryDsn,
    environment: 'test',
    tracesSampleRate: 1.0,
});

console.log('Sentry initialized. Sending test error...');

try {
    throw new Error('Test error from Sentry connection verification script');
} catch (error) {
    Sentry.captureException(error);
    console.log('Error captured and sent to Sentry!');
}

// Give Sentry time to send the error
setTimeout(() => {
    Sentry.close(2000).then(() => {
        console.log('✅ Test complete! Check your Sentry dashboard for the error.');
        console.log('   Project: react-native');
        console.log('   Organization: tradecreditscore');
        process.exit(0);
    });
}, 1000);
