"use client";
import supabase from "@api/supabaseBrowser";
import z from "zod";
import NextLink from "next/link"
import { Icon } from "@iconify/react";
import { AuthDivider, AuthSection, AuthTitle } from "./AuthSection";
import { Button, Input, Checkbox, Link } from "@nextui-org/react";
import {
  FieldError,
  FormErrors,
  nullResolver,
  AlertBox,
} from "@components/Form";
import { PasswordInput } from "./Input";
import { throwOnError } from "@util/SupabaseUtil";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

const signInWithGithub = async (redirectTo) => {
  await supabase.auth
    .signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `http://localhost:3000/auth/callback`,
      },
    })
    .then(throwOnError);
};

const signInWithGoogle = async (redirectTo) => {
  await supabase.auth
    .signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo ?? '/' },
    })
    .then(throwOnError);
};

export const SignInPlatformSection = ({ redirectTo }) => (
  <div className="flex flex-col gap-2">
    <Button
      onClick={signInWithGoogle.bind(null, redirectTo ?? '/')}
      startContent={<Icon icon="flat-color-icons:google" width={24} />}
      variant="bordered"
    >
      Continue with Google
    </Button>
    <Button
      onClick={signInWithGithub.bind(null, redirectTo ?? '/')}
      startContent={
        <Icon className="text-default-500" icon="fe:github" width={24} />
      }
      variant="bordered"
    >
      Continue with Github
    </Button>
  </div>
);

const signUpSchema = z
  .object({
    confirmPassword: z
      .string()
      .min(1, { message: "Required" })
      .min(6, { message: "Password must have 6 or more characters" }),
    email: z.string().min(1, { message: "Required" }).email(),
    password: z
      .string()
      .min(1, { message: "Required" })
      .min(6, { message: "Password must have 6 or more characters" }),
    /*
  legal: z.literal(true, {
    errorMap: () => ({message: 'Required'}),
  }),
  */
  })
  .refine((form) => form.password === form.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

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

export const EmailAuthForm = ({ view, redirectTo }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isLoading },
    setError,
    control,
  } = useForm({
    resolver: view === "signUp" ? zodResolver(signUpSchema) : nullResolver(),
    //reValidateMode: 'onBlur',
  });
  const [status, setStatus] = useState();
  const router = useRouter();

  const signUp = useCallback(
    async (formData) => {
      const { data, error } = await supabase.auth.signUp({
        ...formData,
        options: { emailRedirectTo: redirectTo ?? '/' },
      });
      if (error) {
        setError("root.form", { type: "form", message: error.message });
      } else {
        const { user, session } = data;
        if (user && !session) {
          setStatus("checkEmail");
        } else if (user) {
          setStatus("success");
          router.push(redirectTo ?? '/');
        }
      }
    },
    [redirectTo, router, setError]
  );

  const signIn = useCallback(
    async (formData) => {
      const { error } = await supabase.auth
        .signInWithPassword(formData)
        .catch((error) => {
          setError("root.server", { type: "server", message: error.message });
          console.error(error);
        });
      if (error) {
        setError("root.form", { type: "form", message: error.message });
      } else {
        setStatus("Success!");
        router.push(redirectTo ?? '/');
      }
    },
    [redirectTo, router, setError]
  );

  return (
    <form
      className="flex flex-col gap-3"
      action={handleSubmit(view === "signUp" ? signUp : signIn)}
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
          <Checkbox className="py-4" size="sm">
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
                  <Link href="#" size="sm">
                    Terms
                  </Link>
                  &nbsp; and&nbsp;
                  <Link href="#" size="sm">
                    Privacy Policy
                  </Link>
                </Checkbox>
                <FieldError error={error} className="text-tiny" />
              </div>
            )}
          />
        </>
      )}

      <Button color="primary" isLoading={isLoading} type="submit">
        {view === "signIn" ? "Log In" : "Sign Up"}
      </Button>

      <FormErrors errors={errors} />
      <StatusAlertBox status={status} />
    </form>
  );
};


export const EmailAuth = ({view, redirectTo}) =>
  <AuthSection>
    <header>
      <AuthTitle>{view === "signIn" ? "Sign In" : "Sign Up"}</AuthTitle>
    </header>

    <EmailAuthForm view={view} />
    <AuthDivider />
    <SignInPlatformSection redirectTo={redirectTo} />

    {view === "signIn" ? (
      <p className="text-center text-small">
        Need to create an account?&nbsp;
        <Link
          as={NextLink}
          href={{
            pathname: "/auth/register",
            query: { redirectTo },
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
            query: { redirectTo },
          }}
          size="sm"
        >
          Sign In
        </Link>
      </p>
    )}
  </AuthSection>

