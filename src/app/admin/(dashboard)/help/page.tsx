import Image from "next/image";
import { Mail, HelpCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HelpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <Card className="w-full max-w-lg text-center shadow-lg border-0 bg-linear-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
        <CardHeader className="pb-2 pt-8">
          <div className="mx-auto mb-4">
            <Image
              src="/images/help-banner.png"
              alt="Need Help?"
              width={280}
              height={200}
              className="object-contain mx-auto drop-shadow-md"
              priority
            />
          </div>
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <HelpCircle className="h-6 w-6 text-emerald-600" />
            Need Help?
          </CardTitle>
          <CardDescription className="text-base mt-1">
            We&apos;re here to assist you with anything you need.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8 space-y-6">
          <p className="text-muted-foreground text-sm leading-relaxed">
            If you have any questions, issues, or need support regarding leads,
            documents, payments, or anything else — feel free to reach out to
            our admin team.
          </p>

          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Mail className="h-5 w-5" />
              <span className="font-semibold text-sm">Contact Admin</span>
            </div>
            <a
              href="mailto:admin@budgettravelpackages.in"
              className="text-lg font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline transition-colors block"
            >
              admin@budgettravelpackages.in
            </a>
            <p className="text-xs text-muted-foreground">
              We typically respond within 24 hours.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
