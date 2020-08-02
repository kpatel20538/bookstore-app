export function range (start, stop) {
  return stop !== undefined
    ? Array.from({ length: stop - start + 1 }, (_, idx) => idx + start)
    : Array.from({ length: start }, (_, idx) => idx);
}
  
