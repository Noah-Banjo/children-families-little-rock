// The planned-with-the-grant sections show only when the address ends in ?preview=1.
// Without it the public site looks exactly as it did before.
export const isPreview = () => {
  try {
    return new URLSearchParams(window.location.search).get('preview') === '1';
  } catch (e) {
    return false;
  }
};
