import { useState, useCallback, useEffect, useRef } from "react";
import type { Page, NavigateFn } from "./data";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Team from "./pages/Team";
import Projects from "./pages/Projects";
import Gallery from "./pages/Gallery";
import Archive from "./pages/Archive";
import Contact from "./pages/Contact";

function readRoute() {
  const hash = window.location.hash.replace(/^#/, "");
  const [path, query = ""] = hash.split("?");
  const validPages: Page[] = [
    "home",
    "about",
    "events",
    "event-detail",
    "team",
    "projects",
    "project-detail",
    "gallery",
    "archive",
    "contact",
  ];
  const page = validPages.includes(path as Page) ? (path as Page) : "home";
  const params = Object.fromEntries(new URLSearchParams(query).entries());
  return { page, params };
}

function routeHash(page: Page, params: Record<string, string>) {
  const query = new URLSearchParams(params).toString();
  return `#${page}${query ? `?${query}` : ""}`;
}

export default function App() {
  const initialRoute = readRoute();
  const [page, setPage] = useState<Page>(initialRoute.page);
  const [params, setParams] = useState<Record<string, string>>(initialRoute.params);
  const currentHash = useRef(window.location.hash);

  useEffect(() => {
    if (!window.location.hash) {
      const route = readRoute();
      window.history.replaceState(null, "", routeHash(route.page, route.params));
    }

    currentHash.current = window.location.hash;
    const handlePopState = () => {
      if (window.location.hash === currentHash.current) return;
      currentHash.current = window.location.hash;
      const route = readRoute();
      setPage(route.page);
      setParams(route.params);
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    };
  }, []);

  const navigate: NavigateFn = useCallback((to, newParams) => {
    const nextParams = newParams ?? {};
    setPage(to);
    setParams(nextParams);
    window.history.pushState(null, "", routeHash(to, nextParams));
    currentHash.current = window.location.hash;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  function renderPage() {
    switch (page) {
      case "home":         return <Home navigate={navigate} />;
      case "about":        return <About navigate={navigate} />;
      case "events":       return <Events navigate={navigate} params={params} />;
      case "event-detail": return <Events navigate={navigate} params={params} detail />;
      case "team":         return <Team navigate={navigate} />;
      case "projects":     return <Projects navigate={navigate} params={params} />;
      case "project-detail": return <Projects navigate={navigate} params={params} detail />;
      case "gallery":      return <Gallery navigate={navigate} />;
      case "archive":      return <Archive navigate={navigate} />;
      case "contact":      return <Contact navigate={navigate} />;
      default:             return <Home navigate={navigate} />;
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <Nav navigate={navigate} currentPage={page} />
      <main className="flex-1">{renderPage()}</main>
      <Footer navigate={navigate} />
    </div>
  );
}
