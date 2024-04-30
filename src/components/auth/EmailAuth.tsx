"use client";
import NextLink from "next/link"
import { Icon } from "@iconify/react";
import { AuthDivider, AuthSection, AuthTitle } from "./AuthSection";
import { Button, Input, Checkbox, Link } from "@nextui-org/react";
import {
  FieldError,
  FormErrors,
  nullResolver,
  AlertBox,
  useTreemapForm,
} from "@components/Form";
import { PasswordInput } from "./Input";
import { Controller } from "react-hook-form";
import { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {signIn as signInAction, signUp as signUpAction, signInWithOAuth} from '@app/(shop)/auth/ServerAction'
import {signUpSchema} from '@app/(shop)/auth/Schema'

export const SignInPlatformSection = ({ returnTo }) => (
  <div className="flex flex-col gap-2">
    <Button
      onPress={() => signInWithOAuth('google', returnTo)}
      startContent={<Icon icon="flat-color-icons:google" width={24} />}
      variant="bordered"
    >
      Continue with Google
    </Button>
    <Button
      onPress={() => signInWithOAuth('github', returnTo)}
      startContent={
        <Icon className="text-default-500" icon="fe:github" width={24} />
      }
      variant="bordered"
    >
      Continue with Github
    </Button>
  </div>
);

const StatusAlertBox = ({ status }) => {
  if (status === "checkEmail") {
    return (
      <AlertBox color="success">
        <p className="mb-1">Account creation successful!</p>
        <p>Please check your email for further instructions</p>
      </AlertBox>
    );
  } else if (status === "success") {
    return (
      <AlertBox color="success">
        <p>Account creation successful!</p>
      </AlertBox>
    );
  }
};

export const EmailAuthForm = ({ view, returnTo }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
  } = useTreemapForm({
    resolver: view === "signUp" ? zodResolver(signUpSchema) : nullResolver(),
    //reValidateMode: 'onBlur',
  });
  const [status, setStatus] = useState();

  const signIn = useCallback(
    formData => signInAction(formData, returnTo),
    [returnTo]
  )

  const signUp = useCallback(
    async formData => {
      const result = await signUpAction(formData, returnTo)
      const {user, session} = result
      if (user && !session) {
        setStatus("checkEmail");
      } else if (user) {
        setStatus("success");
      }
      return result
    },
    [returnTo]
  );

  return (
    <form
      className="flex flex-col gap-3"
      action={handleSubmit(view === 'signUp' ? signUp : signIn)}
    >
      <Input
        {...register("email")}
        autoFocus
        errorMessage={errors.email?.message}
        isInvalid={errors.email != null}
        isRequired
        label="Email Address"
        placeholder="Enter your email"
        type="email"
        variant="bordered"
      />

      <PasswordInput
        {...register("password")}
        errorMessage={errors.password?.message}
        isInvalid={errors.password != null}
        isRequired
        label="Password"
        placeholder="Enter your password"
      />

      {view === "signIn" ? (
        <div className="flex justify-between items-center px-2">
          {/* Remember me doens't do anything right now */}
          <Checkbox className="py-4" size="sm" defaultSelected>
            Remember me
          </Checkbox>
          <Link
            href="/auth/change-password"
            className="text-default-500"
            size="sm"
          >
            Forgot password?
          </Link>
        </div>
      ) : (
        <>
          <PasswordInput
            {...register("confirmPassword")}
            isInvalid={errors.confirmPassword != null}
            isRequired
            label="Confirm Password"
            placeholder="Confirm your password"
            errorMessage={errors.confirmPassword?.message}
          />

          <Controller
            control={control}
            name="legal"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <div className="py-2 hidden">
                {/* Temporarily hide legal checkbox */}
                <Checkbox
                  isSelected={value}
                  onBlur={onBlur}
                  onValueChange={onChange}
                  size="sm"
                >
                  I agree with the&nbsp;
                  <Link href="/help/terms" size="sm">
                    Terms
                  </Link>
                  &nbsp; and&nbsp;
                  <Link href="/help/privacy" size="sm">
                    Privacy Policy
                  </Link>
                </Checkbox>
                <FieldError error={error} className="text-tiny" />
              </div>
            )}
          />
        </>
      )}

      <Button color="primary" isLoading={isSubmitting} type="submit">
        {view === "signIn" ? "Log In" : "Sign Up"}
      </Button>

      <FormErrors errors={errors} />
      <StatusAlertBox status={status} />
    </form>
  );
};


export const EmailAuth = ({view, returnTo}) =>
  <AuthSection>
    <header>
      <AuthTitle>{view === "signIn" ? "Sign In" : "Sign Up"}</AuthTitle>
    </header>

    <EmailAuthForm view={view} returnTo={returnTo} />
    <AuthDivider />
    <SignInPlatformSection returnTo={returnTo} />

    {view === "signIn" ? (
      <p className="text-center text-small">
        Need to create an account?&nbsp;
        <Link
          as={NextLink}
          href={{
            pathname: "/auth/register",
            query: returnTo ? {returnTo} : {},
          }}
          size="sm"
        >
          Sign Up
        </Link>
      </p>
    ) : (
      <p className="text-center text-small">
        Already have an account?&nbsp;
        <Link
          as={NextLink}
          href={{
            pathname: "/auth",
            query: returnTo ? {returnTo} : {},
          }}
          size="sm"
        >
          Sign In
        </Link>
      </p>
    )}
  </AuthSection>

