import { InputHTMLAttributes } from "react";
import { Label, Input } from "@/components/atoms";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export default function FormField({ label, error, hint, id, required, ...inputProps }: FormFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s/g, "-");
  return (
    <div>
      <Label htmlFor={fieldId} required={required}>{label}</Label>
      <Input id={fieldId} error={error} required={required} {...inputProps} />
      {hint && !error && <p className="mt-1 text-xs text-text-sub">{hint}</p>}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
