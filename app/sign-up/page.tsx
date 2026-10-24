import { AuthForm } from "@/src/features/auth/auth-form";

export default function SignUpPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12 sm:px-8">
      <div aria-hidden="true" className="absolute -left-32 top-16 size-72 rounded-full bg-[#e9def7] blur-3xl" />
      <div aria-hidden="true" className="absolute -right-28 bottom-12 size-72 rounded-full bg-[#f9dedf] blur-3xl" />
      <AuthForm mode="sign-up" />
    </main>
  );
}
