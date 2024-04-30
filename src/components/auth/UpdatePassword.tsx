"use client";
import { AuthSection, AuthTitle } from "./AuthSection";
import { Button } from "@nextui-org/react";
import { HiKey } from "react-icons/hi";
import { PasswordInput } from "./Input";
import { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {FormErrors, useTreemapForm} from "@components/Form";
import {updatePasswordSchema} from '@app/(shop)/auth/Schema'
import {updatePassword as updatePasswordAction} from '@app/(shop)/auth/ServerAction'

export const UpdatePasswordForm = ({returnTo}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useTreemapForm({
    resolver: zodResolver(updatePasswordSchema),
  });

  const updatePassword = useCallback(
    formData => updatePasswordAction(formData, returnTo),
    [returnTo]
  )

  return (
    <form className="flex flex-col gap-3" action={handleSubmit(updatePassword)}>
      <PasswordInput
        {...register("password")}
        errorMessage={errors.password?.message}
        isInvalid={errors.password != null}
        isRequired
        label="New Password"
        placeholder="Enter your new password"
      />

      <PasswordInput
        {...register("confirmPassword")}
        isInvalid={errors.confirmPassword != null}
        isRequired
        label="Confirm Password"
        placeholder="Confirm your password"
        errorMessage={errors.confirmPassword?.message}
      />

      <Button
        className="w-full"
        color="primary"
        isLoading={isSubmitting}
        startContent={<HiKey className="text-xl" />}
        type="submit"
      >
        Update password
      </Button>

      <FormErrors errors={errors} />
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
