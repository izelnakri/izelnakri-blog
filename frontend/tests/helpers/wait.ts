export default async function (timeout = 300) {
  await new Promise((resolve) => window.setTimeout(() => resolve(), timeout));
}
