import { FormControl } from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Clock, LucideIcon } from "lucide-react";

interface DurationSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  placeholder?: string;
  useFormControl?: boolean;
  icon?: LucideIcon;
  showIcon?: boolean;
}

export const DurationSelect: React.FC<DurationSelectProps> = ({
  value,
  onChange,
  error,
  className,
  placeholder = "Select duration",
  useFormControl = false,
  icon: Icon = Clock,
  showIcon = true,
}) => {
  const trigger = (
    <SelectTrigger
      className={cn(
        "h-11 w-full border-slate-200 dark:border-slate-800 focus:ring-emerald-500/20 bg-slate-50/50 dark:bg-slate-900/50 relative overflow-hidden flex",
        showIcon && "pl-12",
        error && "border-red-500 focus:ring-red-500/20",
        className,
      )}
    >
      {showIcon && (
        <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
        </div>
      )}
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
  );

  return (
    <Select onValueChange={onChange} value={value}>
      {useFormControl ? <FormControl>{trigger}</FormControl> : trigger}
      <SelectContent
        data-lenis-prevent
        position="popper"
        className="w-(--radix-select-trigger-width) max-h-60 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl p-1 overflow-y-auto scrollbar-thin"
      >
        {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
          const val = `${day} Day${day > 1 ? "s" : ""}`;
          return (
            <SelectItem
              key={day}
              value={val}
              className="rounded-lg py-2.5 text-slate-700 dark:text-slate-300 focus:bg-emerald-50 dark:focus:bg-emerald-500/10 focus:text-emerald-700 dark:focus:text-emerald-300 cursor-pointer"
            >
              {val}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
