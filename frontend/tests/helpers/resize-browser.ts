import { run } from '@ember/runloop';

export default function (context, screenType) {
  const browserService = context.owner.lookup('service:browser');

  run(() => {
    if (screenType === 'mobile') {
      browserService.width = browserService.get('maxMobileWidthInPx');
    } else if (screenType === 'tablet') {
      browserService.width = browserService.get('maxTabletWidthInPx');
    } else if (screenType === 'desktop') {
      browserService.width = 1440;
    } else {
      throw new Error(
        'resizeBrowser(screenType) function only expects mobile, table or desktop as screenType argument!'
      );
    }
  });
}
