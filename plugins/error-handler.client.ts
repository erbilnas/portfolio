export default defineNuxtPlugin(() => {
  if (!process.client) return;

  // Enhanced error logging with better formatting for production
  const logError = (type: string, errorData: any) => {
    const errorInfo = {
      type,
      ...errorData,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      environment: process.env.NODE_ENV || 'production',
    };

    // Use console.error with styling for better visibility
    console.groupCollapsed(`%c🔴 ${type}`, 'color: red; font-weight: bold; font-size: 14px;');
    console.error('Full Error Details:', errorInfo);
    
    if (errorData.stack) {
      console.error('Stack Trace:', errorData.stack);
    }
    
    if (errorData.error?.stack) {
      console.error('Error Stack:', errorData.error.stack);
    }
    
    console.groupEnd();
    
    // Also log a simple one-liner for quick scanning
    console.error(`[${type}] ${errorData.message || errorData.reason || 'Unknown error'}`);
  };

  // Global error handler for unhandled errors
  window.addEventListener('error', (event) => {
    logError('Global JavaScript Error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      stack: event.error?.stack,
    });
  });

  // Global error handler for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError('Unhandled Promise Rejection', {
      reason: event.reason,
      promise: event.promise,
      message: event.reason instanceof Error ? event.reason.message : String(event.reason),
      stack: event.reason?.stack,
    });
  });

  // Vue error handler
  const vueApp = useNuxtApp().vueApp;
  if (vueApp) {
    vueApp.config.errorHandler = (err, instance, info) => {
      logError('Vue Component Error', {
        error: err,
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        componentInfo: info,
        componentName: instance?.$options?.name || instance?.$options?.__name || 'Unknown',
      });
    };
  }
});

