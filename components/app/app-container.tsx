import { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "../ui/button";

type AppContainerProps = { children: ReactNode; pageTitle: string };

const AppContainer = ({ children, pageTitle }: AppContainerProps) => {
  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="w-full flex justify-between items-center mb-4">
        <Button variant="ghost" asChild className="p-2">
          <Link href="/app">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
      </div>
      {children}
    </div>
  );
};

export default AppContainer;
