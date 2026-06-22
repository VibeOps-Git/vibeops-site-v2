import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist."
        noindex={true}
      />
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">
            Error 404
          </p>
          <h1 className="mb-4 text-5xl font-semibold text-foreground">
            This page wandered off.
          </h1>
          <p className="mb-8 text-muted-foreground">
            The link may be broken or the page may have moved. Let's get you back on track.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Return home
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
