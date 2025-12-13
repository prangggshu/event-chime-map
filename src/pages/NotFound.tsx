import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-50 font-playfair">
      <div className="text-center px-6">
        <h1 className="mb-4 text-6xl font-extrabold text-orange-700">
          404
        </h1>

        <p className="mb-6 text-xl text-orange-600">
          Oops! Page not found
        </p>

        <Link
          to="/"
          className="inline-block rounded-full bg-orange-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
