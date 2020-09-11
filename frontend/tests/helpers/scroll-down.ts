import scrollUp from './scroll-up';

export default async function (amount = 500, target = 'body', timeToResolveScroll = 300) {
  return await scrollUp(-amount, target, timeToResolveScroll);
}
