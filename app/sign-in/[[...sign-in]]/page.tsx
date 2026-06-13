import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
        <p className="mt-2 text-foreground/60">
          Sign in to your Skilect account
        </p>
        {/* Clerk SignIn component will be placed here */}
        <SignIn path="/sign-in" fallbackRedirectUrl="/dashboard" />
      </div>
    </main> 
  );
}
