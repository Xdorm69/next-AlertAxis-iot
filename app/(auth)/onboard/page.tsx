import { OnboardForm } from "./_components/OnboardForm";

export default function OnboardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="w-full max-w-md p-6 rounded-2xl shadow bg-card">
        <h1 className="text-2xl font-semibold mb-2">Complete Your Profile</h1>
        <p className="text-sm text-gray-500 mb-6">
          Just a few more details to personalize your experience.
        </p>
        <OnboardForm />
      </div>
    </div>
  );
}
