/**
 * Allows you to track the progress of each resolved promise in an array of promises.
 * Progress value is 0-100%. Each resolved promise has equal progress values (ie. 5 promises = 20% each)
 * Note that it's possible to not get 100% as a final value due to rounding (ie. 3 promises = 33.33% each, total of 99.99%)
 * @param promises
 * @param callback Function to handle the current progress 
 */
export function progress(promises: Array<Promise<any>>, callback: (progress: number) => void) {
  let d = 0;
  callback(0);
  for (const p of promises) {
    p.then(() => {
      d++;
      callback((d * 100) / promises.length)
    });
  }
  return Promise.all(promises);
}
