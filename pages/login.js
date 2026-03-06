import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../lib/auth";

export default function Login() {
  const router = useRouter();
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      router.push("/");
    } catch (err) {
      setError(err?.message ?? "Unable to sign in");
    }
  };

  return (
    <>
      <Head>
        <title>{mode === "login" ? "Login" : "Sign Up"} · NetfliX Clone</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="auth-page">
        <div className="auth-card">
          <h1>{mode === "login" ? "Login" : "Create account"}</h1>
          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </label>
            {error ? <p className="auth-error">{error}</p> : null}
            <button
              className="btn btn--primary"
              type="submit"
              disabled={loading}
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="auth-switch">
            {mode === "login" ? (
              <>
                New here?{" "}
                <button type="button" onClick={() => setMode("signup")}>
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button type="button" onClick={() => setMode("login")}>
                  Sign in
                </button>
              </>
            )}
          </p>

          <p className="auth-note">
            For demo purposes, the list is stored per user in Firebase.
          </p>

          <p className="auth-back">
            <Link href="/">← Back to home</Link>
          </p>
        </div>
      </div>
    </>
  );
}
