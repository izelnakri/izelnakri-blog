import $ from 'jquery';
import wait from './wait';

export default async function (amount = 500, target = 'body', timeToResolveScroll = 300) {
  const targetElement = document.querySelector(target);
  const existingScrollCoordinate = $(targetElement).scrollTop();
  const targetCoordinate = existingScrollCoordinate - amount;

  targetElement.scrollTo(0, targetCoordinate);

  await wait(timeToResolveScroll);
}
