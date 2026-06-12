export function SettingItem({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div
      className="
        flex items-center justify-between

        rounded-2xl
        border border-slate-200

        p-4

        transition
        hover:border-blue-300
        hover:bg-slate-50
      "
    >
      <div>
        <h3 className="font-medium text-slate-900">{title}</h3>

        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5"
      />
    </div>
  );
}
