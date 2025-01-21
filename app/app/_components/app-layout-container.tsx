import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardFooter from "./dashboard-footer";
import DashboardHeader from "./dashboard-header";

const AppLayoutContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen justify-between">
      <DashboardHeader />
      <ScrollArea className="container mx-auto p-4 grow">{children}</ScrollArea>
      <DashboardFooter />
    </div>
  );
};

export default AppLayoutContainer;
