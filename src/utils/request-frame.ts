export default function(callback) {
  if (typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(callback);
  } else {
    window.setTimeout(callback, (1000/60));
  }
}
