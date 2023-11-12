export default function useCheckInstallPWA() {
  // @ts-ignore
  return window.navigator?.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
}
