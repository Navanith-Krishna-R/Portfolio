import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets scroll on route change, but honours a hash so deep links such as
 * /#projects land on the right section once React has rendered it.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      // One frame lets the target section mount before we measure it.
      const timer = window.setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);

      return () => window.clearTimeout(timer);
    }

    window.scrollTo(0, 0);
    return undefined;
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
