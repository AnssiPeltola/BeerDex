const titles = ["Beer Info", "Characteristics", "Image Upload", "Review"];

export function WizardProgress({ step }: { step: number }) {
  return (
    <div className="mb-6">
      <h2>
        {step}/4 {titles[step - 1]}
      </h2>

      <progress value={step} max={4} className="w-full" />
    </div>
  );
}
