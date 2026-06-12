import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Sign Up</h1>
        <p className="mt-2 text-foreground/60">
          Create your Skilect account
        </p>
        {/* Clerk SignUp component will be placed here */}
        <SignUp path="/sign-up" fallbackRedirectUrl="/assessment" />
      </div>
    </main>
  );
}
