import { useMemo, useState, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const AUTH_ROLE_KEY = "auth:role";

const Login = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [studentEmail, setStudentEmail] = useState("23052873@kiit.ac.in");
  const [studentPassword, setStudentPassword] = useState("");
  const [societyEmail, setSocietyEmail] = useState("usc@kiit.ac.in");
  const [societyCode, setSocietyCode] = useState("");
  const [societyPassword, setSocietyPassword] = useState("");

  const highlightedRole = useMemo(() => {
    const role = searchParams.get("role");
    return role === "society" ? "society" : "student";
  }, [searchParams]);

  const handleStudentLogin = useCallback(() => {
    const email = studentEmail.trim().toLowerCase();
    const password = studentPassword.trim();

    if (email !== "23052873@kiit.ac.in".toLowerCase()) {
      toast({
        title: "Student login failed",
        description: "Use the assigned campus email 23052873@kiit.ac.in.",
        variant: "destructive",
      });
      return;
    }

    if (!password) {
      toast({
        title: "Password required",
        description: "Any password works here—enter one to continue.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Student login accepted",
      description: "Demo login granted for 23052873@kiit.ac.in.",
    });
    try {
      localStorage.setItem(AUTH_ROLE_KEY, "student");
    } catch (error) {
      console.error("Failed to store auth role", error);
    }
    navigate("/", { replace: true });
  }, [studentEmail, studentPassword, toast]);

  const handleSocietyLogin = useCallback(() => {
    const email = societyEmail.trim().toLowerCase();
    const password = societyPassword.trim();
    const code = societyCode.trim();

    if (email !== "usc@kiit.ac.in".toLowerCase()) {
      toast({
        title: "Society login failed",
        description: "Use the assigned society email usc@kiit.ac.in.",
        variant: "destructive",
      });
      return;
    }

    if (!password) {
      toast({
        title: "Password required",
        description: "Any password works here—enter one to continue.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Society login accepted",
      description: `Demo login granted for usc@kiit.ac.in${code ? " (code noted)" : "."}`,
    });
    try {
      localStorage.setItem(AUTH_ROLE_KEY, "society");
    } catch (error) {
      console.error("Failed to store auth role", error);
    }
    navigate("/manage-events", { replace: true });
  }, [societyEmail, societyPassword, societyCode, toast, navigate]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/4 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
      </div>

      <div className="container relative mx-auto px-4 py-12 lg:py-16">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Dual-access portal for students & societies
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Sign in to plan, post, and RSVP
              </h1>
              <p className="text-lg text-muted-foreground lg:max-w-2xl">
                Pick the door that fits you. Students can RSVP and save events. Societies can publish, manage
                RSVPs, and track interest.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="gradient" size="lg">
                <Link to="/login?role=student">Student login</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login?role=society">Society login</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link to="/">Back to events</Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-card/80 px-4 py-3 text-sm text-muted-foreground shadow-card backdrop-blur">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Single campus login</p>
              <p>Use your university email to keep your profile synced.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card
            id="student"
            className={cn(
              "border-border/80 shadow-card transition-all duration-300",
              highlightedRole === "student" && "ring-2 ring-primary/40 shadow-card-hover",
            )}
          >
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <UserRound className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <CardTitle>Student login</CardTitle>
                <CardDescription>RSVP, save events, and sync reminders to your calendar.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="student-email">
                  Campus email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="student-email"
                    type="email"
                    placeholder="you@university.edu"
                    className="pl-10"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="student-password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="student-password"
                    type="password"
                    placeholder="Any password works"
                    className="pl-10"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Demo access: any password is accepted.</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button className="w-full sm:w-auto" size="lg" type="button" onClick={handleStudentLogin}>
                Continue as student
              </Button>
              <Button variant="link" type="button">
                Forgot password?
              </Button>
            </CardFooter>
          </Card>

          <Card
            id="society"
            className={cn(
              "border-border/80 shadow-card transition-all duration-300",
              highlightedRole === "society" && "ring-2 ring-accent/40 shadow-card-hover",
            )}
          >
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="rounded-xl bg-accent/10 p-3 text-accent">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <CardTitle>Society login</CardTitle>
                <CardDescription>Publish events, manage RSVPs, and message attendees.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="society-email">
                  Society email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="society-email"
                    type="email"
                    placeholder="events@society.org"
                    className="pl-10"
                    value={societyEmail}
                    onChange={(e) => setSocietyEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="society-code">
                  Society access code
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="society-code"
                    type="text"
                    placeholder="Enter code (optional for demo)"
                    className="pl-10"
                    value={societyCode}
                    onChange={(e) => setSocietyCode(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Optional for demo; add your code when live.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="society-password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="society-password"
                    type="password"
                    placeholder="Any password works"
                    className="pl-10"
                    value={societyPassword}
                    onChange={(e) => setSocietyPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                className="w-full sm:w-auto"
                size="lg"
                variant="accent"
                type="button"
                onClick={handleSocietyLogin}
              >
                Continue as society
              </Button>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Button variant="link" type="button">
                  Reset access
                </Button>
                <span className="hidden sm:inline">•</span>
                <Button variant="link" asChild>
                  <a href="mailto:support@campus-events.edu">Contact support</a>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/80 bg-card/60 px-6 py-5 text-center text-sm text-muted-foreground shadow-inner">
          <div className="flex items-center gap-2 text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to the event list any time.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="sm" variant="outline">
              <Link to="/">Browse events</Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link to="/login?role=student">Student login</Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link to="/login?role=society">Society login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
