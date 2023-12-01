"use client";

import ListErrors from "@/components/common/ListErrors";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useFetch } from "@/hooks/useFetch";
import { signIn } from "next-auth/react";

interface SignFormProps {
  isRegister?: boolean;
}

const SignForm = ({ isRegister }: SignFormProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, data, errors, request } = useFetch<{ user: any }>();

  const { login } = useAuth();
  const router = useRouter();
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isRegister) {
      const formData = { user: { username, email, password } };
      await request("/users", "POST", formData);
    } else {
      // const formData = { user: { email, password } };
      // await request("/users/login", "POST", formData);
      signIn("credentials", {
        email,
        password,
        redirect: false,
      }).then((callback) => {
        if (callback?.ok) {
          router.push("/");
        }
      });
    }
    // if (data) {
    //   login(data.user.token);
    //   router.push("/");
    // }
  };
  return (
    <>
      <ListErrors errors={errors} />
      <form onSubmit={handleFormSubmit}>
        {isRegister && (
          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="text"
              name="username"
              placeholder="Username"
              data-testid="input-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </fieldset>
        )}
        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="text"
            name="email"
            placeholder="Email"
            data-testid="input-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </fieldset>
        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="password"
            name="password"
            placeholder="Password"
            data-testid="input-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </fieldset>
        <button
          className="btn btn-lg btn-primary pull-xs-right"
          data-testid="btn-submit"
          disabled={loading}
        >
          {isRegister ? "Sign up" : "Sign in"}
        </button>
      </form>
    </>
  );
};

export default SignForm;