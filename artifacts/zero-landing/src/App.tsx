import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { I18nProvider } from "@/contexts/i18n-context";
import { CurrencyProvider } from "@/contexts/currency-context";
import { SiteSettingsProvider } from "@/contexts/site-settings-context";
import { SiteSeo } from "@/components/seo/SiteSeo";

// Lightweight spinner shown while a chunk loads
function ChunkLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-xs font-mono text-muted-foreground">// loading...</p>
      </div>
    </div>
  );
}

// ── Public pages ─────────────────────────────────────────────────────────
const LandingGate     = lazy(() => import("@/pages/landing-gate"));
const Login           = lazy(() => import("@/pages/login"));
const Register        = lazy(() => import("@/pages/register"));
const Terms           = lazy(() => import("@/pages/terms"));
const Privacy         = lazy(() => import("@/pages/privacy"));
const NotFound        = lazy(() => import("@/pages/not-found"));

// ── Authenticated public pages ────────────────────────────────────────────
const Home            = lazy(() => import("@/pages/home"));
const Portfolio       = lazy(() => import("@/pages/portfolio"));
const Clients         = lazy(() => import("@/pages/clients"));
const Pricing         = lazy(() => import("@/pages/pricing"));
const Support         = lazy(() => import("@/pages/support"));
const About           = lazy(() => import("@/pages/about"));
const Contact         = lazy(() => import("@/pages/contact"));
const Blog            = lazy(() => import("@/pages/blog"));
const BlogPost        = lazy(() => import("@/pages/blog-post"));
const Services        = lazy(() => import("@/pages/services"));
const FAQ             = lazy(() => import("@/pages/faq"));
const TestimonialsPage = lazy(() => import("@/pages/testimonials-page"));
const Partners        = lazy(() => import("@/pages/partners"));
const Roadmap         = lazy(() => import("@/pages/roadmap"));
const Changelog       = lazy(() => import("@/pages/changelog"));
const Community       = lazy(() => import("@/pages/community"));
const UserProfile     = lazy(() => import("@/pages/user-profile"));
const CV              = lazy(() => import("@/pages/cv"));
const Certificates    = lazy(() => import("@/pages/certificates"));
const Tools           = lazy(() => import("@/pages/tools"));
const Calculator      = lazy(() => import("@/pages/calculator"));
const LinkRedirect    = lazy(() => import("@/pages/link-redirect"));
const Resources       = lazy(() => import("@/pages/resources"));
const AdminCV         = lazy(() => import("@/pages/cv"));

// ── Admin pages ───────────────────────────────────────────────────────────
const AdminLogin          = lazy(() => import("@/pages/admin/login"));
const AdminDashboard      = lazy(() => import("@/pages/admin/dashboard"));
const AdminProjects       = lazy(() => import("@/pages/admin/projects"));
const AdminClients        = lazy(() => import("@/pages/admin/clients"));
const AdminMessages       = lazy(() => import("@/pages/admin/messages"));
const AdminSettings       = lazy(() => import("@/pages/admin/settings"));
const AdminAnalytics      = lazy(() => import("@/pages/admin/analytics"));
const AdminKanban         = lazy(() => import("@/pages/admin/kanban"));
const AdminServicesManager = lazy(() => import("@/pages/admin/services-manager"));
const AdminActivity       = lazy(() => import("@/pages/admin/activity"));
const AdminProfile        = lazy(() => import("@/pages/admin/profile"));
const AdminBlog           = lazy(() => import("@/pages/admin/blog"));
const AdminTestimonials   = lazy(() => import("@/pages/admin/testimonials"));
const AdminFaqManager     = lazy(() => import("@/pages/admin/faq-manager"));
const AdminSkillsManager  = lazy(() => import("@/pages/admin/skills-manager"));
const AdminMedia          = lazy(() => import("@/pages/admin/media"));
const AdminSeo            = lazy(() => import("@/pages/admin/seo"));
const AdminUsers          = lazy(() => import("@/pages/admin/users"));
const AdminLinkMask       = lazy(() => import("@/pages/admin/link-mask"));
const AdminSecurity       = lazy(() => import("@/pages/admin/security"));
const AdminCodeEditor     = lazy(() => import("@/pages/admin/code-editor"));
const AdminCertificates   = lazy(() => import("@/pages/admin/certificates"));
const AdminMasterVersion  = lazy(() => import("@/pages/admin/master-version"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

// ── Route guards ──────────────────────────────────────────────────────────

function AuthRoute({ component: Comp }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Redirect to="/login" />;
  return <Comp />;
}

function AdminRoute({ component: Comp }: { component: React.ComponentType }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Redirect to="/login" />;
  if (!isAdmin) return <Redirect to="/" />;
  return <Comp />;
}

function GuestRoute({ component: Comp }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Redirect to="/" />;
  return <Comp />;
}

// ── Route trees ───────────────────────────────────────────────────────────

function PublicRoutes() {
  return (
    <Suspense fallback={<ChunkLoader />}>
      <Switch>
        <Route path="/"><Home /></Route>

        <Route path="/login"><GuestRoute component={Login} /></Route>
        <Route path="/register"><GuestRoute component={Register} /></Route>
        <Route path="/terms"><Terms /></Route>
        <Route path="/privacy"><Privacy /></Route>
        <Route path="/r/:slug"><LinkRedirect /></Route>

        <Route path="/portfolio"><Portfolio /></Route>
        <Route path="/clients"><Clients /></Route>
        <Route path="/pricing"><Pricing /></Route>
        <Route path="/support"><Support /></Route>
        <Route path="/about"><About /></Route>
        <Route path="/contact"><Contact /></Route>
        <Route path="/blog"><Blog /></Route>
        <Route path="/blog/:slug"><BlogPost /></Route>
        <Route path="/services"><Services /></Route>
        <Route path="/faq"><FAQ /></Route>
        <Route path="/testimonials"><TestimonialsPage /></Route>
        <Route path="/partners"><Partners /></Route>
        <Route path="/roadmap"><Roadmap /></Route>
        <Route path="/changelog"><Changelog /></Route>
        <Route path="/community"><Community /></Route>
        <Route path="/profile"><AuthRoute component={UserProfile} /></Route>
        {/* The CV and its certificates are portfolio content, so visitors can
            view certificates without creating an account. */}
        <Route path="/cv"><CV /></Route>
        <Route path="/certificates"><Certificates /></Route>
        <Route path="/tools"><Tools /></Route>
        <Route path="/calculator"><Calculator /></Route>
        <Route path="/resources"><Resources /></Route>
        <Route path="/admincv"><AdminCV /></Route>

        <Route><NotFound /></Route>
      </Switch>
    </Suspense>
  );
}

function AdminRoutes() {
  return (
    <Suspense fallback={<ChunkLoader />}>
      <Switch>
        <Route path="/admin/login"><AdminLogin /></Route>
        <Route path="/admin"><AdminRoute component={AdminDashboard} /></Route>
        <Route path="/admin/projects"><AdminRoute component={AdminProjects} /></Route>
        <Route path="/admin/clients"><AdminRoute component={AdminClients} /></Route>
        <Route path="/admin/messages"><AdminRoute component={AdminMessages} /></Route>
        <Route path="/admin/settings"><AdminRoute component={AdminSettings} /></Route>
        <Route path="/admin/analytics"><AdminRoute component={AdminAnalytics} /></Route>
        <Route path="/admin/kanban"><AdminRoute component={AdminKanban} /></Route>
        <Route path="/admin/services-manager"><AdminRoute component={AdminServicesManager} /></Route>
        <Route path="/admin/activity"><AdminRoute component={AdminActivity} /></Route>
        <Route path="/admin/profile"><AdminRoute component={AdminProfile} /></Route>
        <Route path="/admin/blog"><AdminRoute component={AdminBlog} /></Route>
        <Route path="/admin/testimonials"><AdminRoute component={AdminTestimonials} /></Route>
        <Route path="/admin/faq"><AdminRoute component={AdminFaqManager} /></Route>
        <Route path="/admin/skills"><AdminRoute component={AdminSkillsManager} /></Route>
        <Route path="/admin/media"><AdminRoute component={AdminMedia} /></Route>
        <Route path="/admin/seo"><AdminRoute component={AdminSeo} /></Route>
        <Route path="/admin/users"><AdminRoute component={AdminUsers} /></Route>
        <Route path="/admin/link-mask"><AdminRoute component={AdminLinkMask} /></Route>
        <Route path="/admin/security"><AdminRoute component={AdminSecurity} /></Route>
        <Route path="/admin/code-editor"><AdminRoute component={AdminCodeEditor} /></Route>
        <Route path="/admin/certificates"><AdminRoute component={AdminCertificates} /></Route>
        <Route path="/admin/master-version"><AdminRoute component={AdminMasterVersion} /></Route>
        <Route><NotFound /></Route>
      </Switch>
    </Suspense>
  );
}

function Router() {
  const [location] = useLocation();
  return (
    <>
      <SiteSeo />
      {location.startsWith("/admin") ? <AdminRoutes /> : <PublicRoutes />}
    </>
  );
}

function AppInner() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <SiteSettingsProvider>
          <CurrencyProvider>
            <AuthProvider>
              <TooltipProvider>
                <AppInner />
                <Toaster />
                <SonnerToaster
                  position="top-center"
                  richColors
                  toastOptions={{ duration: 3000 }}
                />
              </TooltipProvider>
            </AuthProvider>
          </CurrencyProvider>
        </SiteSettingsProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
