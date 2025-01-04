"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { treeEvidenceSchema, TreeEvidenceSchema } from "@/lib/validations/tree";
import useCurrentSession from "@/components/providers/session-provider";
import { LoadingAnimation } from "@/components/common/loading-animation";
import { addTreeEvidence } from "@/actions/tree/add-evidence";

type AddVideoEvidenceFormProps = { treeId: string };

const AddVideoEvidenceForm = ({ treeId }: AddVideoEvidenceFormProps) => {
  const [isPending, startTransition] = useTransition();
  const { accessToken } = useCurrentSession();
  // 1. Define your form.
  const form = useForm<TreeEvidenceSchema>({
    resolver: zodResolver(treeEvidenceSchema),
    defaultValues: {
      accessToken,
      treeId,
      type: "VIDEO",
      url: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: TreeEvidenceSchema) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    startTransition(async () => {
      try {
        const result = await addTreeEvidence(values);

        if (result.success) {
          toast.success("Evidence added successfully");
        } else {
          // TODO: Handle error (e.g., show error message to user)
          toast.error(result.error);
          console.error(result.error);
        }
      } catch (error) {
        toast.error("Network error");
      }
    });
  }

  if (!accessToken) {
    return null;
  }

  return (
    <div className="grid gap-2">
      <Separator className="my-1" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add Video Proof</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://www.youtube.com/watch?v=LXb3EKWsInQ"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The link to your uploaded YouTube video proof.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? <LoadingAnimation /> : " Add Evidence"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddVideoEvidenceForm;
