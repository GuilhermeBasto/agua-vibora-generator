import { useFetcher, useNavigate } from "react-router";
import { ConfigurationForm } from "~/components/ConfigurationForm";
import { Footer } from "~/components/Footer";
import { PageHeader } from "~/components/PageHeader";
import type { GeneratedSchedule } from "~/lib/types";
import { useEffect } from "react";
import InfoBlock from "~/components/InfoBlock";

export default function CreateCustomSchedulePage() {
  const fetcher = useFetcher<GeneratedSchedule>();
  const navigate = useNavigate();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      navigate("/create-custom-schedule/view", {
        state: { generatedSchedule: fetcher.data },
        replace: true,
      });
    }
  }, [fetcher.state, fetcher.data, navigate]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      // Navigate to view with the schedule data in context
      navigate("view", {
        state: { generatedSchedule: fetcher.data },
      });
    }
  }, [fetcher.state, fetcher.data, navigate]);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-0 sm:px-4">
      <div className="bg-slate-900/80 sm:rounded-2xl shadow-2xl border-x sm:border border-slate-800 overflow-hidden backdrop-blur-xl transition-all duration-500">
        <>
          <PageHeader
            title="Nova Aviança Personalizada"
            subtitle="Configure os horários de rega das aldeias"
            icon="template"
            backLink="/"
            backLabel="Voltar"
          />
          <div className="p-4 sm:p-10">
            <InfoBlock
              text="Esta ferramenta permite criar uma aviança personalizada."
              type="warning"
            />
            <div className="mt-8 bg-slate-950/30 rounded-2xl border border-slate-700/30 p-2 sm:p-6">
              <ConfigurationForm
                onSubmit={(data) => {
                  const fd = new FormData();
                  fd.append("data", JSON.stringify(data));
                  fetcher.submit(fd, {
                    method: "POST",
                    action: "/api/create-schedule",
                  });
                }}
              />
            </div>
          </div>
        </>
      </div>
      <Footer />
    </div>
  );
}
