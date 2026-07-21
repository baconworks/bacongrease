/**
 * The inline script to run in the document <head> BEFORE first paint, to prevent a theme flash
 * (FOUC): it stamps `data-theme` on the root from the persisted preference so the right theme is
 * applied before anything renders. Mirrors `ThemeToggle`'s mount logic exactly — it stamps ONLY when
 * there's an explicit stored choice; with none it leaves `data-theme` unset, so the CSS
 * `prefers-color-scheme` default follows the OS (and keeps following it live). Kept here beside the
 * toggle so the two can't drift on the storage key or the stamping rule.
 *
 * Why an inline script (not a React effect or an external file)? To beat the flash, `data-theme`
 * must be set SYNCHRONOUSLY, before the browser's first paint. A `useEffect` runs AFTER paint — that
 * IS the flash — and a `defer`/`async`/`src` script is likewise too late. Only a synchronous inline
 * <script> in <head> runs early enough. This is browser-paint timing, not a workaround: it's the
 * same technique next-themes, Chakra UI's `ColorModeScript`, and Theme UI's `InitializeColorMode`
 * all ship. Background: Josh Comeau, "The Perils of Rehydration"
 * — https://www.joshwcomeau.com/react/the-perils-of-rehydration/
 *
 * `dangerouslySetInnerHTML` is safe here: the content is a static, app-authored constant with no
 * interpolation of user data, so there's no injection surface.
 *
 * Server-safe (returns a string). Inject with:
 *   <script dangerouslySetInnerHTML={{ __html: themeInitScript( 'sp-theme' ) }} />
 * Pass the SAME `storageKey` the app gives `ThemeToggle`.
 */
export const themeInitScript = ( storageKey = 'bg-theme' ): string =>
  `(function(){try{var t=localStorage.getItem(${ JSON.stringify( storageKey ) });`
  + `if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;
