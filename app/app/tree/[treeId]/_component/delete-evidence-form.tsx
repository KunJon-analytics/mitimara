"use client";

import { Trash } from "lucide-react";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  DeleteEvidenceSchema,
  deleteEvidenceSchema,
} from "@/lib/validations/tree";
import useCurrentSession from "@/components/providers/session-provider";
import { LoadingAnimation } from "@/components/common/loading-animation";
import { deleteTreeEvidence } from "@/actions/tree/delete-evidence";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";

type DeleteEvidenceFormProps = { evidenceId: string };

const DeleteEvidenceForm = ({ evidenceId }: DeleteEvidenceFormProps) => {
  const [isPending, startTransition] = useTransition();
  const { accessToken } = useCurrentSession();

  // 1. Define your form.
  const form = useForm<DeleteEvidenceSchema>({
    resolver: zodResolver(deleteEvidenceSchema),
    defaultValues: {
      accessToken,
      evidenceId,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: DeleteEvidenceSchema) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    startTransition(async () => {
      try {
        const result = await deleteTreeEvidence(values);

        if (result.success) {
          toast.success("Evidence deleted successfully");

          // invalidate tree && nearby tree
        } else {
          // TODO: Handle error (e.g., show error message to user)
          toast.error(result.error);
          console.log(result.error);
        }
      } catch (error) {
        console.log(error);
        toast.error("Network error");
      }
    });
  }

  if (!accessToken) {
    return null;
  }

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button variant={"destructive"} size={"icon"}>
          <Trash />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Delete Evidence?</CredenzaTitle>
          <CredenzaDescription>
            This action is not reversible, continue?
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Button
                type="submit"
                disabled={isPending}
                variant={"destructive"}
                className="w-full"
              >
                {isPending ? <LoadingAnimation /> : "Delete"}
              </Button>
            </form>
          </Form>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
};

export default DeleteEvidenceForm;
