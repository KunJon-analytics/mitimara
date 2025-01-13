import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

import { Icons } from "@/components/common/icons";
import { getReferrer } from "@/lib/services/referrer";
import { LinkCards } from "./_components/link-cards";
import { searchParamsCache } from "./search-params";

const AlertTriangle = Icons["alert-triangle"];

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function InvitePage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { ref } = searchParamsCache.parse(searchParams);

  const referrer = ref ? await getReferrer(ref) : null;

  if (!referrer) {
    return (
      <div className="mx-auto flex h-full max-w-xl flex-1 flex-col items-center justify-center gap-4">
        <h1 className="font-semibold text-2xl">Invitation</h1>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            You were not invited by an active user.
          </AlertDescription>
        </Alert>
        <Separator className="my-4" />
        <p className="text-muted-foreground">Quick Links </p>
        <LinkCards />
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full max-w-xl flex-1 flex-col items-center justify-center gap-4">
      <h1 className="font-semibold text-2xl">Invitation</h1>
      <Alert>
        <Icons.check className="h-4 w-4" />
        <AlertTitle>Ready to go</AlertTitle>
        <AlertDescription>{`You were referred by ${referrer.username}`}</AlertDescription>
      </Alert>
      <Separator className="my-4" />
      <p className="text-muted-foreground">Quick Links</p>
      <LinkCards referral={referrer.username} />
    </div>
  );
}
