"use client";
import { AlertBox } from "@components/Form";
import { AuthSection, AuthTitle } from "./AuthSection";
import { Button } from "@nextui-org/react";
import { HiKey } from "react-icons/hi";
import { PasswordInput } from "./Input";
import { Present } from "@util/Present";
import { useState, useCallback } from "react";
import supabase from "@api/supabaseBrowser";

const StatusAlertBox = ({ status }) =>
  status === "passwordUpdated" ? (
    <AlertBox color="success">
      <p>Your password has been updated</p>
    </AlertBox>
  ) : undefined;

export const UpdatePasswordForm = () => {
  const [response, setResponse] = useState(
    Present.resolve({}).reactWorkaround()
  );

  const updatePassword = useCallback(async (formData) => {
    setResponse(Present.pend);
    const { error } = await supabase.auth.updateUser({
      password: formData.password,
    });
    setResponse(
      error
        ? Present.reject(error)
        : Present.resolve({ status: "passwordUpdated" })
    );
  }, []);

  return (
    <form id="auth-update-password" action={updatePassword}>
      <PasswordInput
        isRequired
        label="New Password"
        name="password"
        placeholder="Enter your new password"
      />

      <Button
        className="w-full my-4"
        color="primary"
        isLoading={response.pending()}
        startContent={<HiKey className="text-xl" />}
        type="submit"
      >
        Update password
      </Button>

      {response
        .then(StatusAlertBox, (error) => (
          <p className="text-red-600">{error.message}</p>
        ))
        .orPending()}
    </form>
  );
};

export const UpdatePassword = () => (
  <AuthSection>
    <header>
      <AuthTitle>Update Password</AuthTitle>
    </header>
    <UpdatePasswordForm />
  </AuthSection>
);
