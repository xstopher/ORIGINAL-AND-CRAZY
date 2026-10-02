import { FormEvent, useEffect, useState } from "react";
import {
  Link,
  Navigate,
  NavLink,
  Outlet,
  createBrowserRouter,
  useLocation,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router";

export type Category = "Clothes" | "Hats" | "Shoes";
export type Product = {
  id: number;
  name: string;
  category: Category;
  price: number;
  image: string;
  tag?: string;
  description?: string;
};
export type CartItem = Product & { quantity: number };

export type StoreContext = {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (id: number, amount: number) => void;
  addProduct: (product: Product) => void;
  clearCart: () => void;
  subtotal: number;
  isLoggedIn: boolean;
  isOwner: boolean;
  login: (email: string, password: string) => "owner" | "customer";
  signup: () => void;
  logout: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  openCart: () => void;
  replayIntro: () => void;
};

const OWNER_EMAIL = "owner@originalcrazy.com";
const OWNER_PASSWORD = "owner2025";

const productsSeed: Product[] = [
  {
    id: 1,
    name: "Rebel utility jacket",
    category: "Clothes",
    price: 4200,
    tag: "New Drop",
    description: "Heavyweight tactile canvas with matte black hardware and oversized tactical pockets.",
    image: "https://images.unsplash.com/photo-1648322032202-73cb85f354be?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "After dark set",
    category: "Clothes",
    price: 3600,
    tag: "Limited",
    description: "Structured silhouette with reflective piping and relaxed drop-shoulder tailoring.",
    image: "https://images.unsplash.com/photo-1763750581767-b367bcd6c117?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "OC violet runners",
    category: "Shoes",
    price: 5100,
    tag: "Selling Fast",
    description: "Chunky sole platform with ultraviolet accents and ultra-responsive all-day comfort.",
    image: "https://images.unsplash.com/photo-164832206-888c91d99616?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Concrete crop",
    category: "Clothes",
    price: 2800,
    description: "Raw distressed hemline cut from 340gsm combed organic cotton.",
    image: "https://images.unsplash.com/photo-1692782378084-4e95dbee3ddf?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "No rules cap",
    category: "Hats",
    price: 1400,
    tag: "Bestseller",
    description: "Unstructured 6-panel design with embroidered ethos and gunmetal rear strap.",
    image: "https://images.unsplash.com/photo-1737505467345-771456972a6d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Monochrome layer",
    category: "Clothes",
    price: 3900,
    description: "Thermal lined overshirt with modular sleeve snaps and deep chest welt.",
    image: "https://images.unsplash.com/photo-1609084415979-e38c11583e8b?auto=format&fit=crop&w=900&q=85",
  },
];

export function Icon({
  name,
  size = 20,
}: {
  name:
    | "bag"
    | "sun"
    | "moon"
    | "arrow"
    | "plus"
    | "minus"
    | "x"
    | "upload"
    | "check"
    | "menu"
    | "home"
    | "grid"
    | "user"
    | "maximize"
    | "minimize"
    | "sparkles"
    | "search"
    | "filter"
    | "shield"
    | "layout-grid"
    | "layout-list"
    | "share"
    | "play";
  size?: number;
}) {
  const paths: Record<string, React.ReactNode> = {
    bag: (
      <>
        <path d="M6 8h12l-1 12H7L6 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
      </>
    ),
    moon: <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />,
    arrow: (
      <>
        <path d="M5 12h14M14 7l5 5-5 5" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    x: <path d="m6 6 12 12M18 6 6 18" />,
    upload: (
      <>
        <path d="M12 16V4M7 9l5-5 5 5" />
        <path d="M5 15v5h14v-5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    home: (
      <>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </>
    ),
    user: (
      <>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    maximize: (
      <>
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
      </>
    ),
    minimize: (
      <>
        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </>
    ),
    filter: (
      <>
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </>
    ),
    "layout-grid": (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </>
    ),
    "layout-list": (
      <>
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </>
    ),
    share: (
      <>
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </>
    ),
    play: (
      <>
        <polygon points="5 3 19 12 5 21 5 3" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

/**
 * 4-SECOND COOL BRAND SPLASH ANIMATION
 */
function IntroSplash({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [statusText, setStatusText] = useState("INITIALIZING ENGINE...");

  useEffect(() => {
    const startTime = Date.now();
    const duration = 4000; // 4 seconds total

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(currentProgress);

      if (elapsed > 1200 && elapsed <= 2400) {
        setStatusText("SYNCING NAIROBI STREETWEAR...");
      } else if (elapsed > 2400 && elapsed <= 3400) {
        setStatusText("DROP 004 ASSETS UNLOCKED");
      } else if (elapsed > 3400) {
        setStatusText("ACCESS GRANTED");
      }

      if (elapsed >= 3600 && !isExiting) {
        setIsExiting(true);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        onFinish();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onFinish, isExiting]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(onFinish, 200);
  };

  return (
    <div className={`intro-splash ${isExiting ? "intro-exit" : ""}`} role="dialog" aria-modal="true">
      {/* Background ambient cosmos glow */}
      <div className="intro-bg-glow" />
      <div className="intro-grid-mesh" />

      {/* Skip button for quick convenience */}
      <button className="intro-skip-btn" onClick={handleSkip} aria-label="Skip intro animation">
        <span>Skip</span>
        <Icon name="arrow" size={12} />
      </button>

      <div className="intro-centerpiece">
        {/* Animated outer orbital rings */}
        <div className="intro-orbit-ring ring-outer" />
        <div className="intro-orbit-ring ring-inner" />
        
        {/* Glowing aura around brand logo */}
        <div className="intro-logo-glow" />

        {/* The User's Brand Logo */}
        <div className="intro-logo-wrapper">
          <img
            src="/brand-logo.jpg"
            alt="Original & Crazy Brand Logo"
            className="intro-logo-img"
          />
          {/* Laser shine overlay sweep */}
          <div className="intro-shine-sweep" />
          {/* Gleaming central star pulse */}
          <div className="intro-center-star-burst" />
        </div>

        {/* Cinematic brand title reveal */}
        <div className="intro-brand-title">
          <div className="intro-main-brand">
            <span>ORIGINAL</span>
            <b className="purple-text">&amp; CRAZY</b>
          </div>
          <p className="intro-sub-brand">NAIROBI STREETWEAR &bull; DROP 004</p>
        </div>
      </div>

      {/* Bottom loading HUD and laser progress bar */}
      <div className="intro-footer-hud">
        <div className="intro-hud-status">
          <span className="intro-status-dot" />
          <span className="intro-status-text">{statusText}</span>
          <span className="intro-percentage">{progress}%</span>
        </div>
        <div className="intro-progress-track">
          <div className="intro-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [products, setProducts] = useState<Product[]>(productsSeed);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [showFsBanner, setShowFsBanner] = useState(true);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);

  // 4-second initial splash intro state
  const [introActive, setIntroActive] = useState(true);

  const [session, setSession] = useState<"owner" | "customer" | null>(() => {
    const saved = window.localStorage.getItem("oc-session");
    if (saved === "owner" || saved === "customer") return saved;
    return window.localStorage.getItem("oc-owner-session") === "true" ? "owner" : null;
  });

  const isOwner = session === "owner";
  const isLoggedIn = session !== null;
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Fullscreen & PWA detection and management
  useEffect(() => {
    const checkDisplayMode = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: fullscreen)").matches ||
        (window.navigator as any).standalone === true;

      setIsStandalone(isStandaloneMode);
      if (document.fullscreenElement) {
        setIsFullscreen(true);
      } else {
        setIsFullscreen(isStandaloneMode);
      }
    };

    checkDisplayMode();

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement || isStandalone);
    };

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, [isStandalone]);

  // Automatic fullscreen trigger on first user interaction
  useEffect(() => {
    if (hasUserInteracted || isFullscreen || isStandalone) return;

    const requestFullscreenOnFirstGesture = () => {
      setHasUserInteracted(true);
      const docEl = document.documentElement;
      const requestFs =
        docEl.requestFullscreen ||
        (docEl as any).webkitRequestFullscreen ||
        (docEl as any).msRequestFullscreen;

      if (requestFs && !document.fullscreenElement) {
        requestFs
          .call(docEl)
          .then(() => {
            setIsFullscreen(true);
            setShowFsBanner(false);
          })
          .catch(() => {
            // Handled silently
          });
      }
    };

    window.addEventListener("click", requestFullscreenOnFirstGesture, { once: true });
    window.addEventListener("touchstart", requestFullscreenOnFirstGesture, { once: true });

    return () => {
      window.removeEventListener("click", requestFullscreenOnFirstGesture);
      window.removeEventListener("touchstart", requestFullscreenOnFirstGesture);
    };
  }, [hasUserInteracted, isFullscreen, isStandalone]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const docEl = document.documentElement;
        const requestFs =
          docEl.requestFullscreen ||
          (docEl as any).webkitRequestFullscreen ||
          (docEl as any).msRequestFullscreen;
        if (requestFs) {
          await requestFs.call(docEl);
          setIsFullscreen(true);
          setShowFsBanner(false);
        }
      } else {
        const exitFs =
          document.exitFullscreen ||
          (document as any).webkitExitFullscreen ||
          (document as any).msExitFullscreen;
        if (exitFs) {
          await exitFs.call(document);
          setIsFullscreen(false);
        }
      }
    } catch {
      // Handled silently
    }
  };

  const handleInstallApp = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setDeferredInstallPrompt(null);
      }
    } else {
      toggleFullscreen();
    }
  };

  const addToCart = (product: Product) => {
    if (!isLoggedIn) {
      navigate("/login?required=cart");
      return;
    }
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      return existing
        ? current.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...current, { ...product, quantity: 1 }];
    });
    setToast(`${product.name} added to bag`);
    window.setTimeout(() => setToast(""), 2400);
  };

  const updateQuantity = (id: number, amount: number) => {
    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + amount } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const context: StoreContext = {
    products,
    cart,
    addToCart,
    updateQuantity,
    addProduct: (product) => {
      setProducts((current) => [product, ...current]);
      setToast("New piece added to storefront");
      window.setTimeout(() => setToast(""), 2400);
    },
    clearCart: () => setCart([]),
    subtotal,
    isLoggedIn,
    isOwner,
    login: (email, password) => {
      if (email.toLowerCase().trim() === OWNER_EMAIL && password === OWNER_PASSWORD) {
        window.localStorage.setItem("oc-session", "owner");
        setSession("owner");
        return "owner";
      }
      window.localStorage.setItem("oc-session", "customer");
      setSession("customer");
      return "customer";
    },
    signup: () => {
      window.localStorage.setItem("oc-session", "customer");
      setSession("customer");
    },
    logout: () => {
      window.localStorage.removeItem("oc-owner-session");
      window.localStorage.removeItem("oc-session");
      setSession(null);
    },
    isFullscreen,
    toggleFullscreen,
    openCart: () => setCartOpen(true),
    replayIntro: () => setIntroActive(true),
  };

  return (
    <div className="app" data-theme={theme} data-fullscreen={isFullscreen ? "true" : "false"}>
      {/* 4-Second Animated Brand Logo Intro */}
      {introActive && <IntroSplash onFinish={() => setIntroActive(false)} />}

      {/* Top Mobile Web App Fullscreen Bar / Install Prompt */}
      {!isFullscreen && showFsBanner && (
        <aside className="webapp-banner" aria-label="Fullscreen Web App Experience">
          <div className="webapp-banner-content">
            <span className="live-pill">
              <span className="live-dot" /> WEB APP READY
            </span>
            <span className="banner-text">Tap to enjoy full-bleed fullscreen experience</span>
          </div>
          <div className="webapp-banner-actions">
            <button
              className="webapp-trigger-btn"
              onClick={handleInstallApp}
              title="Enter Fullscreen Web App Mode"
            >
              <Icon name="maximize" size={14} />
              <span>Fullscreen App</span>
            </button>
            <button
              className="banner-close-btn"
              onClick={() => setShowFsBanner(false)}
              aria-label="Dismiss banner"
            >
              <Icon name="x" size={14} />
            </button>
          </div>
        </aside>
      )}

      {/* Main Header */}
      <header className="header">
        <div className="header-left">
          <button
            className="menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <Icon name={mobileMenuOpen ? "x" : "menu"} size={22} />
          </button>
          <button
            className="fs-toggle-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Web App"}
            aria-label="Toggle Fullscreen Mode"
          >
            <Icon name={isFullscreen ? "minimize" : "maximize"} size={17} />
            <span className="fs-label">{isFullscreen ? "Exit FS" : "App Mode"}</span>
          </button>
        </div>

        {/* Brand Header with actual animated logo icon */}
        <Link className="brand" to="/" aria-label="Original and Crazy home">
          <div className="brand-logo-badge">
            <img src="/brand-logo.jpg" alt="OC Logo" className="header-brand-img" />
          </div>
          <div className="brand-text">
            <span>ORIGINAL</span>
            <b>&amp; CRAZY</b>
          </div>
          <span className="brand-badge">DROP 004</span>
        </Link>

        {/* Desktop & Tablet Navigation */}
        <nav className={mobileMenuOpen ? "nav nav-open" : "nav"}>
          <NavLink to="/" end onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/shop" onClick={() => setMobileMenuOpen(false)}>
            Shop Drop
          </NavLink>
          <NavLink to="/shop?category=Clothes" onClick={() => setMobileMenuOpen(false)}>
            Clothing
          </NavLink>
          <NavLink to="/shop?category=Hats" onClick={() => setMobileMenuOpen(false)}>
            Hats
          </NavLink>
          <NavLink to="/shop?category=Shoes" onClick={() => setMobileMenuOpen(false)}>
            Footwear
          </NavLink>
          {isOwner && (
            <NavLink to="/owner" className="owner-badge-link" onClick={() => setMobileMenuOpen(false)}>
              Owner Studio
            </NavLink>
          )}
          <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
            Account
          </NavLink>
          {isLoggedIn && (
            <button
              className="nav-logout"
              onClick={() => {
                context.logout();
                setMobileMenuOpen(false);
              }}
            >
              Log out
            </button>
          )}
        </nav>

        <div className="header-actions">
          <button
            className="icon-button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
          >
            <Icon name={theme === "light" ? "moon" : "sun"} size={18} />
          </button>
          <button
            className="cart-button"
            onClick={() => setCartOpen(true)}
            aria-label={`Open shopping bag with ${itemCount} items`}
          >
            <Icon name="bag" size={18} />
            <span className="cart-text">Bag</span>
            <b className="cart-badge">{itemCount}</b>
          </button>
        </div>
      </header>

      {/* Main Viewport Content */}
      <div className="app-body">
        <Outlet context={context} />
      </div>

      <Footer onReplayIntro={() => setIntroActive(true)} />

      {/* Mobile App Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation Bar">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
        >
          <Icon name="home" size={20} />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/shop"
          className={({ isActive }) =>
            `bottom-nav-item ${isActive && !location.search.includes("category=") ? "active" : ""}`
          }
        >
          <Icon name="grid" size={20} />
          <span>Shop</span>
        </NavLink>
        <button
          className={`bottom-nav-item bottom-cart-trigger ${itemCount > 0 ? "has-items" : ""}`}
          onClick={() => setCartOpen(true)}
          aria-label="Open Cart"
        >
          <div className="bottom-cart-icon-wrap">
            <Icon name="bag" size={20} />
            {itemCount > 0 && <span className="bottom-cart-bubble">{itemCount}</span>}
          </div>
          <span>Bag</span>
        </button>
        {isOwner ? (
          <NavLink
            to="/owner"
            className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
          >
            <Icon name="sparkles" size={20} />
            <span>Studio</span>
          </NavLink>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
          >
            <Icon name="user" size={20} />
            <span>Account</span>
          </NavLink>
        )}
      </nav>

      {/* Feedback Toast */}
      {toast && (
        <div className="toast" role="status">
          <Icon name="check" size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* Cart / Bag Drawer / Mobile Bottom Sheet */}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          subtotal={subtotal}
          updateQuantity={updateQuantity}
          onClose={() => setCartOpen(false)}
        />
      )}
    </div>
  );
}

function Footer({ onReplayIntro }: { onReplayIntro?: () => void }) {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand-wrap">
          <img src="/brand-logo.jpg" alt="OC Brand Logo" className="footer-logo-img" />
          <Link className="brand footer-brand" to="/">
            <span>ORIGINAL</span>
            <b>&amp; CRAZY</b>
          </Link>
        </div>
        <p className="footer-tagline">
          Designed for the wonderfully difficult. Nairobi to the universe.
        </p>
      </div>
      <div className="footer-bottom">
        <div className="footer-links">
          <Link to="/shop">Shop Collection</Link>
          <Link to="/login">Member Access</Link>
          <Link to="/checkout">Fast Checkout</Link>
          {onReplayIntro && (
            <button className="footer-replay-btn" onClick={onReplayIntro}>
              <Icon name="play" size={12} />
              <span>Replay Intro</span>
            </button>
          )}
        </div>
        <div className="footer-meta">
          <span>&copy; {new Date().getFullYear()} O&amp;C Worldwide. All rights reserved.</span>
          <span className="pwa-badge">Web App Fullscreen Ready</span>
        </div>
      </div>
    </footer>
  );
}

function Home() {
  const { addToCart, products, replayIntro } = useOutletContext<StoreContext>();
  const featured = products.slice(0, 4);

  return (
    <main className="home-container">
      {/* Dynamic Hero */}
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-eyebrow-row">
            <p className="eyebrow">
              <span className="eyebrow-bar" />
              Nairobi / Drop 004
            </p>
            <span className="live-status-pill">
              <span className="live-pulse" />
              LIMITED RUN
            </span>
          </div>

          <h1>
            Normal is
            <br />
            <em>overrated.</em>
          </h1>

          <p className="hero-description">
            Original cuts. Crazy energy. Clothes for people who never needed permission to stand out.
            Scaled and tailored for pure mobile streetwear.
          </p>

          <div className="hero-cta-group">
            <Link className="primary-button hero-main-btn" to="/shop">
              <span>Shop the Drop</span>
              <Icon name="arrow" size={18} />
            </Link>
            <button className="secondary-button" onClick={replayIntro} title="Watch Brand Intro">
              <Icon name="play" size={14} />
              <span>Brand Intro</span>
            </button>
          </div>

          <div className="hero-meta">
            <div className="meta-card">
              <strong>100%</strong>
              <span>Boldly original</span>
            </div>
            <div className="meta-card">
              <strong>48H</strong>
              <span>Fast delivery</span>
            </div>
            <div className="meta-card">
              <strong>M-PESA</strong>
              <span>1-tap checkout</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-stamp">
            <span>NOT</span>
            <span>FOR</span>
            <span>EVERYONE</span>
          </div>
          <img
            src="https://images.unsplash.com/photo-1635874555221-dcbc881e80fd?auto=format&fit=crop&w=1400&q=90"
            alt="Model in contemporary streetwear jacket"
            loading="eager"
          />
          <div className="hero-overlay-tag">
            <span>WEAR THE PLOT TWIST</span>
          </div>
        </div>
      </section>

      {/* Mobile Department Horizontal Snap Reel */}
      <section className="home-categories">
        <div className="categories-header">
          <p className="eyebrow">
            <span className="eyebrow-bar" />
            Choose your chaos
          </p>
          <h2>Pick a department.</h2>
        </div>

        <div className="category-cards-grid">
          <Link to="/shop?category=Clothes" className="cat-card">
            <div className="cat-card-number">01</div>
            <div className="cat-card-title">
              <h3>Clothing</h3>
              <span>Jackets, tees &amp; sets</span>
            </div>
            <div className="cat-card-arrow">
              <Icon name="arrow" size={20} />
            </div>
          </Link>

          <Link to="/shop?category=Hats" className="cat-card">
            <div className="cat-card-number">02</div>
            <div className="cat-card-title">
              <h3>Hats</h3>
              <span>Caps, beanies &amp; buckets</span>
            </div>
            <div className="cat-card-arrow">
              <Icon name="arrow" size={20} />
            </div>
          </Link>

          <Link to="/shop?category=Shoes" className="cat-card">
            <div className="cat-card-number">03</div>
            <div className="cat-card-title">
              <h3>Footwear</h3>
              <span>Chunky runners &amp; kicks</span>
            </div>
            <div className="cat-card-arrow">
              <Icon name="arrow" size={20} />
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Drops Grid */}
      <section className="featured-section">
        <div className="section-header-compact">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-bar" />
              Spotlight
            </p>
            <h2>Top silhouettes.</h2>
          </div>
          <Link to="/shop" className="text-link">
            See all pieces <Icon name="arrow" size={14} />
          </Link>
        </div>

        <div className="product-grid mobile-two-col">
          {featured.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              addToCart={addToCart}
            />
          ))}
        </div>
      </section>

      {/* Manifesto Callout */}
      <section className="manifesto">
        <span className="manifesto-eyebrow">THE ORIGINAL &amp; CRAZY CODE</span>
        <h2>
          Made for the
          <br />
          <em>fearless.</em>
        </h2>
        <p className="manifesto-text">
          Life is too short for basic silhouettes and muted energy. Step into the full screen of who
          you are.
        </p>
        <Link to="/shop" className="manifesto-button">
          <span>Claim your piece</span>
          <Icon name="arrow" size={18} />
        </Link>
      </section>
    </main>
  );
}

function Shop() {
  const { products, addToCart } = useOutletContext<StoreContext>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const requestedCategory = searchParams.get("category");
  const category =
    requestedCategory && ["Clothes", "Hats", "Shoes"].includes(requestedCategory)
      ? requestedCategory
      : "All";

  const categories = ["All", "Clothes", "Hats", "Shoes"];

  const filtered = products.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="page-main">
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">
            <span className="eyebrow-bar" />
            Drop 004 / Full catalog
          </p>
          <h1>
            The new
            <br />
            <em>disorder.</em>
          </h1>
          <p className="page-hero-sub">
            Every piece is curated to interrupt the ordinary. Small batches, tactile fabrics,
            unapologetic Nairobi energy.
          </p>
        </div>
      </section>

      <section className="shop-section">
        {/* Sticky Mobile Filter Bar */}
        <div className="shop-controls-bar">
          <div className="search-box">
            <Icon name="search" size={16} />
            <input
              type="text"
              placeholder="Search drops, jackets, caps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <Icon name="x" size={14} />
              </button>
            )}
          </div>

          <div className="filter-and-view">
            <div className="category-pills-scroll" role="tablist">
              {categories.map((item) => (
                <button
                  key={item}
                  role="tab"
                  aria-selected={category === item}
                  className={`pill-btn ${category === item ? "active" : ""}`}
                  onClick={() =>
                    setSearchParams(item === "All" ? {} : { category: item })
                  }
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="view-mode-toggle">
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid view"
                aria-label="Grid view"
              >
                <Icon name="layout-grid" size={16} />
              </button>
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="Lookbook single column view"
                aria-label="Single column view"
              >
                <Icon name="layout-list" size={16} />
              </button>
            </div>
          </div>

          <div className="results-count-bar">
            <span>
              Showing {filtered.length} piece{filtered.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {/* Product Grid / List */}
        {filtered.length === 0 ? (
          <div className="empty-catalog">
            <Icon name="search" size={40} />
            <h3>No matching pieces</h3>
            <p>Try searching for something else or reset your category filter.</p>
            <button
              className="primary-button"
              onClick={() => {
                setSearchQuery("");
                setSearchParams({});
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            className={`product-grid ${
              viewMode === "grid" ? "mobile-two-col" : "mobile-one-col-editorial"
            }`}
          >
            {filtered.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                addToCart={addToCart}
                isEditorial={viewMode === "list"}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ProductCard({
  product,
  index,
  addToCart,
  isEditorial = false,
}: {
  product: Product;
  index: number;
  addToCart: (product: Product) => void;
  isEditorial?: boolean;
}) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  };

  return (
    <article className={`product-card ${isEditorial ? "editorial-card" : ""}`}>
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <button
          className={`quick-add ${added ? "added-pulse" : ""}`}
          onClick={handleAdd}
          aria-label={`Add ${product.name} to bag`}
          title={`Add ${product.name} to bag`}
        >
          <Icon name={added ? "check" : "plus"} size={18} />
        </button>
        <span className="item-number">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <div className="product-info">
        <div className="product-title-group">
          <h3>{product.name}</h3>
          <p className="product-category">{product.category}</p>
          {isEditorial && product.description && (
            <p className="product-desc-editorial">{product.description}</p>
          )}
        </div>
        <strong className="product-price">KSh {product.price.toLocaleString()}</strong>
      </div>
    </article>
  );
}

function CartDrawer({
  cart,
  subtotal,
  updateQuantity,
  onClose,
}: {
  cart: CartItem[];
  subtotal: number;
  updateQuantity: StoreContext["updateQuantity"];
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="overlay" onMouseDown={onClose}>
      <aside className="drawer mobile-bottom-sheet" onMouseDown={(e) => e.stopPropagation()}>
        {/* Mobile drag handle indicator */}
        <div className="sheet-handle" onClick={onClose} />

        <div className="drawer-header">
          <div>
            <p>Your Bag</p>
            <span>
              {itemCount} item{itemCount === 1 ? "" : "s"}
            </span>
          </div>
          <button className="icon-button close-btn" onClick={onClose} aria-label="Close bag">
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="cart-list">
          {cart.length === 0 ? (
            <div className="empty-state">
              <Icon name="bag" size={44} />
              <h3>Your bag is feeling empty.</h3>
              <p>Add something crazy from Drop 004 to bring it to life.</p>
              <button
                className="primary-button"
                onClick={() => {
                  onClose();
                  navigate("/shop");
                }}
              >
                <span>Explore the drop</span>
                <Icon name="arrow" size={16} />
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="cart-item-copy">
                  <div className="cart-item-top">
                    <p>{item.category}</p>
                    <h3>{item.name}</h3>
                    <strong>KSh {item.price.toLocaleString()}</strong>
                  </div>
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      aria-label="Decrease quantity"
                    >
                      <Icon name="minus" size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      aria-label="Increase quantity"
                    >
                      <Icon name="plus" size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-summary">
            <div className="subtotal-row">
              <span>Subtotal</span>
              <strong>KSh {subtotal.toLocaleString()}</strong>
            </div>
            <p className="delivery-hint">Fast delivery &amp; M-PESA checkout available</p>
            <button
              className="primary-button checkout-trigger-btn"
              onClick={() => {
                onClose();
                navigate("/checkout");
              }}
            >
              <span>Go to checkout</span>
              <Icon name="arrow" size={18} />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

function Checkout() {
  const { cart, subtotal, clearCart } = useOutletContext<StoreContext>();
  const [ordered, setOrdered] = useState(false);
  const deliveryFee = subtotal ? 250 : 0;
  const total = subtotal + deliveryFee;

  if (ordered) {
    return (
      <main className="standalone-page">
        <section className="success checkout-success">
          <div className="success-icon">
            <Icon name="check" size={38} />
          </div>
          <p className="success-eyebrow">ORDER CONFIRMED</p>
          <h2>
            You&apos;re officially
            <br />
            part of the crazy.
          </h2>
          <span>
            Payment prompt initiated. We will dispatch your gear within 24 to 48 hours with SMS
            tracking.
          </span>
          <Link className="primary-button" to="/shop" onClick={clearCart}>
            <span>Continue shopping</span>
            <Icon name="arrow" size={16} />
          </Link>
        </section>
      </main>
    );
  }

  if (!cart.length) {
    return (
      <main className="standalone-page">
        <section className="empty-state checkout-empty">
          <Icon name="bag" size={48} />
          <h2>Your bag is empty.</h2>
          <p>You&apos;ll need at least one piece before proceeding to checkout.</p>
          <Link className="primary-button" to="/shop">
            <span>Shop the drop</span>
            <Icon name="arrow" size={16} />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <section className="checkout-intro">
        <p className="eyebrow">
          <span className="eyebrow-bar" />
          SECURE CHECKOUT / DROP 004
        </p>
        <h1>
          Almost
          <br />
          <em>yours.</em>
        </h1>
        <span>Complete your delivery info. Mobile money prompts trigger directly on your phone.</span>
      </section>

      <section className="checkout-panel">
        <div className="checkout-order">
          <h2>Order Summary</h2>
          <div className="checkout-items-list">
            {cart.map((item) => (
              <div key={item.id} className="checkout-item-row">
                <img src={item.image} alt={item.name} />
                <div className="checkout-item-details">
                  <strong>{item.name}</strong>
                  <span>
                    Qty {item.quantity} &bull; KSh {item.price.toLocaleString()} each
                  </span>
                </div>
                <b>KSh {(item.price * item.quantity).toLocaleString()}</b>
              </div>
            ))}
          </div>
        </div>

        <form
          className="checkout-form"
          onSubmit={(e) => {
            e.preventDefault();
            setOrdered(true);
          }}
        >
          <div className="form-group-title">
            <h3>Shipping Details</h3>
          </div>

          <div className="two-column">
            <label>
              Full name
              <input required placeholder="Alex Kamau" />
            </label>
            <label>
              Phone number (for M-PESA)
              <input required type="tel" placeholder="0712 345 678" />
            </label>
          </div>

          <label>
            Delivery address
            <input required placeholder="Apartment / Road / City (e.g. Kilimani, Nairobi)" />
          </label>

          <fieldset className="payment-fieldset">
            <legend>Instant Payment Method</legend>
            <div className="payment-options">
              <label className="pay-option-card">
                <input type="radio" name="network" defaultChecked />
                <span className="network mpesa">M</span>
                <div className="option-text">
                  <b>M-PESA Express</b>
                  <span>STK push to phone</span>
                </div>
              </label>
              <label className="pay-option-card">
                <input type="radio" name="network" />
                <span className="network airtel">A</span>
                <div className="option-text">
                  <b>Airtel Money</b>
                  <span>Instant push</span>
                </div>
              </label>
            </div>
          </fieldset>

          <div className="checkout-breakdown">
            <div className="breakdown-row">
              <span>Items subtotal</span>
              <span>KSh {subtotal.toLocaleString()}</span>
            </div>
            <div className="breakdown-row">
              <span>Express delivery</span>
              <span>KSh {deliveryFee.toLocaleString()}</span>
            </div>
            <div className="checkout-total">
              <span>Total amount</span>
              <strong>KSh {total.toLocaleString()}</strong>
            </div>
          </div>

          <button className="primary-button pay-button" type="submit">
            <span>Pay KSh {total.toLocaleString()} now</span>
            <Icon name="arrow" size={18} />
          </button>
          <p className="payment-note">
            <Icon name="shield" size={13} />
            Encrypted mobile authorization. You will enter your PIN on your handset.
          </p>
        </form>
      </section>
    </main>
  );
}

function Owner() {
  const { products, addProduct, isOwner } = useOutletContext<StoreContext>();
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [fileName, setFileName] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    addProduct({
      id: Date.now(),
      name: String(data.get("name")),
      category: String(data.get("category")) as Category,
      price: Number(data.get("price")),
      image: image || productsSeed[0].image,
      tag: "Just In",
    });
    navigate("/shop");
  };

  if (!isOwner) return <Navigate to="/login" replace />;

  return (
    <main className="owner-page">
      <section className="owner-page-intro">
        <p className="eyebrow">
          <span className="eyebrow-bar" />
          OWNER STUDIO / INVENTORY
        </p>
        <h1>
          Drop something
          <br />
          <em>original.</em>
        </h1>
        <span>Add a new piece directly to the storefront catalog. Instant mobile sync.</span>
        <div className="owner-stats">
          <strong>{products.length}</strong>
          <span>Live catalog products</span>
        </div>
      </section>

      <section className="owner-page-form">
        <div className="form-heading">
          <span>NEW LISTING</span>
          <h2>Product Details</h2>
        </div>
        <form className="owner-form" onSubmit={submit}>
          <label className="upload-zone">
            {image ? (
              <img src={image} alt="New product preview" />
            ) : (
              <div className="upload-prompt">
                <Icon name="upload" size={32} />
                <strong>Upload product photo</strong>
                <span>PNG or JPG, vertical portrait recommended</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  setImage(URL.createObjectURL(file));
                  setFileName(file.name);
                }
              }}
            />
          </label>
          {fileName && (
            <p className="file-name">
              <Icon name="check" size={15} />
              {fileName}
            </p>
          )}

          <label>
            Product name
            <input required name="name" placeholder="e.g. Cyberpunk heavy knit" />
          </label>

          <div className="two-column">
            <label>
              Category
              <select name="category">
                <option value="Clothes">Clothes</option>
                <option value="Hats">Hats</option>
                <option value="Shoes">Shoes</option>
              </select>
            </label>
            <label>
              Price (KSh)
              <input required min="1" name="price" type="number" placeholder="4200" />
            </label>
          </div>

          <button className="primary-button" type="submit">
            <span>Publish to Store</span>
            <Icon name="arrow" size={18} />
          </button>
        </form>
      </section>
    </main>
  );
}

function Login() {
  const { login, isLoggedIn, isOwner, logout } = useOutletContext<StoreContext>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const cartLoginRequired = searchParams.get("required") === "cart";

  if (isLoggedIn) {
    return (
      <main className="standalone-page">
        <section className="owner-session">
          <div className="success-icon">
            <Icon name="check" size={34} />
          </div>
          <p className="session-tag">{isOwner ? "OWNER STUDIO ACTIVE" : "ACCOUNT ACTIVE"}</p>
          <h2>Welcome back.</h2>
          <span>
            {isOwner
              ? "You are authenticated with store owner and inventory privileges."
              : "You are signed in and ready to collect the latest pieces."}
          </span>
          <div className="session-actions">
            <Link className="primary-button" to={isOwner ? "/owner" : "/shop"}>
              <span>{isOwner ? "Open Owner Studio" : "Continue Shopping"}</span>
              <Icon name="arrow" size={16} />
            </Link>
            <button className="secondary-text-btn" onClick={logout}>
              Log out
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <img
          src="https://images.unsplash.com/photo-1692782378084-4e95dbee3ddf?auto=format&fit=crop&w=1200&q=88"
          alt="Original and Crazy streetwear campaign"
        />
        <div className="auth-visual-copy">
          <p>ORIGINALS ONLY / MEMBERS CLUB</p>
          <h1>
            Welcome
            <br />
            back to the
            <br />
            <em>crazy.</em>
          </h1>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-box">
          <p className="eyebrow">
            <span className="eyebrow-bar" />
            Your Account
          </p>
          <h2>Sign in.</h2>
          <p className="auth-subtitle">
            Access saved pieces, faster mobile checkout, and drop notifications.
          </p>

          {cartLoginRequired && (
            <div className="login-required-message">
              <Icon name="bag" size={20} />
              <div>
                <strong>Sign in to shop</strong>
                <span>Please log in or create an account to add pieces to your bag.</span>
              </div>
            </div>
          )}

          <div className="owner-credentials">
            <span>DEMO OWNER ACCESS</span>
            <div>
              <strong>Email</strong>
              <code>{OWNER_EMAIL}</code>
            </div>
            <div>
              <strong>Password</strong>
              <code>{OWNER_PASSWORD}</code>
            </div>
          </div>

          <form
            className="auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              const result = login(String(data.get("email")), String(data.get("password")));
              setError("");
              navigate(result === "owner" ? "/owner" : "/shop");
            }}
          >
            <label>
              Email address
              <input
                required
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@domain.com"
              />
            </label>
            <label>
              Password
              <div className="password-input">
                <input
                  required
                  name="password"
                  minLength={6}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {error && <p className="auth-error">{error}</p>}

            <div className="auth-options">
              <label>
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <button type="button">Forgot password?</button>
            </div>

            <button className="primary-button auth-submit" type="submit">
              <span>Sign in</span>
              <Icon name="arrow" size={16} />
            </button>
          </form>

          <div className="auth-switch">
            <span>New to Original &amp; Crazy?</span>
            <Link to={cartLoginRequired ? "/signup?required=cart" : "/signup"}>
              Create account <Icon name="arrow" size={14} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Signup() {
  const { signup } = useOutletContext<StoreContext>();
  const [searchParams] = useSearchParams();
  const [created, setCreated] = useState(false);
  const cartLoginRequired = searchParams.get("required") === "cart";

  if (created) {
    return (
      <main className="standalone-page">
        <section className="success auth-success">
          <div className="success-icon">
            <Icon name="check" size={36} />
          </div>
          <p className="success-eyebrow">ACCOUNT CREATED</p>
          <h2>
            You&apos;re in.
            <br />
            Stay original.
          </h2>
          <span>Your account is active. Explore Drop 004 and get priority early access.</span>
          <Link className="primary-button" to="/shop">
            <span>Shop the Drop</span>
            <Icon name="arrow" size={16} />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page signup-page">
      <section className="auth-panel">
        <div className="auth-box">
          <p className="eyebrow">
            <span className="eyebrow-bar" />
            Join the Club
          </p>
          <h2>Create Account.</h2>
          <p className="auth-subtitle">
            Get first access to limited batch drops, exclusive drops, and mobile order updates.
          </p>

          {cartLoginRequired && (
            <div className="login-required-message">
              <Icon name="bag" size={20} />
              <div>
                <strong>Create account to continue</strong>
                <span>Set up your profile to add pieces to your bag.</span>
              </div>
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              signup();
              setCreated(true);
            }}
          >
            <div className="two-column">
              <label>
                First name
                <input required autoComplete="given-name" placeholder="First name" />
              </label>
              <label>
                Last name
                <input required autoComplete="family-name" placeholder="Last name" />
              </label>
            </div>
            <label>
              Email address
              <input required type="email" autoComplete="email" placeholder="you@domain.com" />
            </label>
            <label>
              Phone number
              <input required type="tel" autoComplete="tel" placeholder="0700 000 000" />
            </label>
            <label>
              Password
              <input
                required
                minLength={6}
                type="password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
              />
            </label>

            <label className="terms-check">
              <input required type="checkbox" defaultChecked />
              <span>I agree to terms and want to be notified of limited drops.</span>
            </label>

            <button className="primary-button auth-submit" type="submit">
              <span>Create my account</span>
              <Icon name="arrow" size={16} />
            </button>
          </form>

          <div className="auth-switch">
            <span>Already a member?</span>
            <Link to="/login">
              Sign in <Icon name="arrow" size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="auth-visual signup-visual">
        <img
          src="https://images.unsplash.com/photo-1648322032202-73cb85f354be?auto=format&fit=crop&w=1200&q=88"
          alt="Model wearing purple jacket"
        />
        <div className="auth-visual-copy">
          <p>MEMBERS GET IT FIRST</p>
          <h1>
            Never miss
            <br />
            the next
            <br />
            <em>drop.</em>
          </h1>
        </div>
      </section>
    </main>
  );
}

function NotFound() {
  return (
    <main className="standalone-page">
      <section className="empty-state checkout-empty">
        <h2>Wrong turn.</h2>
        <p>This page isn&apos;t part of the drop.</p>
        <Link className="primary-button" to="/">
          <span>Go Home</span>
          <Icon name="arrow" size={16} />
        </Link>
      </section>
    </main>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "shop", Component: Shop },
      { path: "checkout", Component: Checkout },
      { path: "owner", Component: Owner },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "*", Component: NotFound },
    ],
  },
]);

export default Root;
