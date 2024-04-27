"use client";
import NextLink from "next/link"
import supabase from "@api/supabaseBrowser";
import { AlertBox } from "@components/Form";
import { AuthSection, AuthTitle } from "./AuthSection";
import { HiOutlineMail } from "react-icons/hi";
import { Input, Link, Button } from "@nextui-org/react";
import { Present } from "@util/Present";
import { useState, useCallback } from "react";

const StatusAlertBox = ({ status }) =>
  status === "checkEmail" ? (
    <AlertBox color="warning">
      <p>Check your email for the password reset link</p>
    </AlertBox>
  ) : undefined;

export const ResetPasswordForm = ({}) => {
  const [response, setResponse] = useState(
    Present.resolve({}).reactWorkaround()
  );

  const resetPassword = useCallback(async (formData) => {
    setResponse(Present.pend);
    const { error } = await supabase.auth.resetPasswordForEmail(
      formData.get("email"),
      { redirectTo: `${new URL(window.location).origin}/auth/update-password` }
    );
    setResponse(
      error ? Present.reject(error) : Present.resolve({ status: "checkEmail" })
    );
  }, []);

  return (
    <form id="auth-forgot-password" action={resetPassword}>
      <Input
        isRequired
        label="Email Address"
        name="email"
        placeholder="Enter your email"
        type="email"
        variant="bordered"
      />

      <Button
        className="w-full my-4"
        color="primary"
        isLoading={response.pending()}
        startContent={<HiOutlineMail className="text-xl" />}
        type="submit"
      >
        Send reset password instructions
      </Button>

      {response
        .then(StatusAlertBox, (error) => (
          <p className="text-red-600">{error.message}</p>
        ))
        .orPending()}
    </form>
  );
};

export const ResetPassword = ({returnTo}) =>
  <AuthSection>
    <header>
      <AuthTitle>Reset Password</AuthTitle>
    </header>
    <ResetPasswordForm />

    <p className="text-center">
      <Link 
        as={NextLink}
        href={{
          pathname: "/auth",
          query: returnTo ? {returnTo} : {},
        }}
        size="sm"
      >
        Go back to sign in
      </Link>
    </p>
  </AuthSection>
