import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const AUTH_TOKEN_KEY = "authToken";
import { GraduationCap, Building2, Eye } from "lucide-react";

const AUTH_ROLE_KEY = "auth:role";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("student");

  const [societyName, setSocietyName] = useState("");
  const [email, setEmail] = useState(
    role === "student" ? "23052873@kiit.ac.in" : "usc@kiit.ac.in"
  );
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (role === "student" && email !== "23052873@kiit.ac.in") {
      alert("Use campus email: 23052873@kiit.ac.in");
      return;
    }

    if (role === "society" && email !== "usc@kiit.ac.in") {
      alert("Use society email: usc@kiit.ac.in");
      return;
    }

    if (!password) {
      alert("Password required");
      return;
    }

    localStorage.setItem(AUTH_ROLE_KEY, role);
    localStorage.setItem(AUTH_TOKEN_KEY, `${role}-demo-token`);

    const from = (location.state as any)?.from?.pathname as string | undefined;
    if (from) {
      navigate(from, { replace: true });
    } else {
      navigate(role === "student" ? "/" : "/manage-events");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-playfair">

      {/* LEFT HERO */}
      <div
        className="hidden lg:flex flex-col justify-between px-16 py-14 text-white relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2')",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-wide">
            Events
            <span className="ml-1 text-orange-400/90">
              Everywhere
            </span>
          </h1>

          <br /><br />

          <h1 className="text-4xl font-extrabold leading-tight mb-6">
            Never Miss a Campus Event Again
          </h1>

          <p className="text-lg font-normal opacity-90 max-w-md">
            Your unified portal for all campus activities. Discover workshops,
            hackathons, cultural fests, and more.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4 mt-10">
          {[
            "Smart Recommendations",
            "Calendar Integration",
            "Event Reminders",
            "All Categories",
          ].map((item) => (
            <div
              key={item}
              className="bg-white/15 backdrop-blur-md rounded-xl px-2 py-4 text-lg font-normal text-center"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT LOGIN */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">

          <h2 className="text-3xl font-bold mb-2 text-center">
            Welcome Back
          </h2>

          <p className="text-gray-500 font-normal mb-8 text-center">
            Sign in to continue to your dashboard
          </p>

          {/* ROLE TOGGLE */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setRole("student")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition font-semibold tracking-wide
                ${role === "student"
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-gray-200 text-gray-500"}`}
            >
              <GraduationCap size={18} /> Student
            </button>

            <button
              onClick={() => setRole("society")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition font-semibold tracking-wide
                ${role === "society"
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-gray-200 text-gray-500"}`}
            >
              <Building2 size={18} /> Society
            </button>
          </div>

          {/* SOCIETY NAME */}
          {role === "society" && (
            <div className="mb-4">
              <label className="text-sm font-semibold">Society Name</label>
              <input
                type="text"
                value={societyName}
                onChange={(e) => setSocietyName(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          )}

          {/* EMAIL */}
          <div className="mb-4">
            <label className="text-sm font-semibold">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-6 relative">
            <label className="text-sm font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 outline-none pr-10"
            />
            <Eye className="absolute right-3 top-10 text-gray-400" size={18} />
          </div>

          {/* SIGN IN */}
          <button
            onClick={handleLogin}
            className="w-full py-4 rounded-xl text-white font-semibold tracking-wide text-lg
                       bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 transition"
          >
            Sign In →
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don’t have an account?{" "}
            <span className="text-orange-600 cursor-pointer">Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
}
