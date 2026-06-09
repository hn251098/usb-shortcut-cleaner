import dayjs from "dayjs";
import { Clock3 } from "lucide-react";

interface Props {
  message: string;
  timestamp: string;
}

export function ActivityCard({ message, timestamp }: Props) {
  return (
    <div
      className="
        rounded-2xl
        bg-white
        p-4
        shadow-sm
        inline-flex
        w-full justify-between
      "
    >
      <div>
        <p className="text-sm font-medium">{message}</p>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Clock3 size={14} />

        {dayjs(timestamp).format("HH:mm:ss DD/MM/YYYY")}
      </div>
    </div>
  );
}
