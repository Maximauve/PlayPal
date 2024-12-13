import useTranslation from "@/hooks/use-translation";

export default function DashboardLayout() {
  const i18n = useTranslation();
  return (
    <div>
      <h1 className="text-3xl text-center pt-10 text-white font-bold tracking-tighter sm:text-4xl md:text-5xl">{i18n.t("admin.dashboard.title")}</h1>
    </div>
  );
}