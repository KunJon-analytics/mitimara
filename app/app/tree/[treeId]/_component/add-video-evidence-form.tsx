"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { treeEvidenceSchema, TreeEvidenceSchema } from "@/lib/validations/tree";
import useCurrentSession from "@/components/providers/session-provider";
import { LoadingAnimation } from "@/components/common/loading-animation";
import { addTreeEvidence } from "@/actions/tree/add-evidence";
import {
  CardContent,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type AddVideoEvidenceFormProps = { treeId: string };

const AddVideoEvidenceForm = ({ treeId }: AddVideoEvidenceFormProps) => {
  const [isPending, startTransition] = useTransition();
  const { accessToken, session } = useCurrentSession();

  const queryClient = useQueryClient();

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
          queryClient.invalidateQueries({ queryKey: ["profile", session.id] });
          form.resetField("url");
        } else {
          // TODO: Handle error (e.g., show error message to user)
          toast.error(result.error);
          console.error(result.error);
        }
      } catch (error) {
        console.error(error);
        toast.error("Network error");
      }
    });
  }

  if (!accessToken) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Youtube Video Link</CardTitle>
        <CardDescription>
          Video should show the tree, tree code and any other landmark.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.youtube.com/watch?v=LXb3EKWsInQ"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <LoadingAnimation /> : "Add Video Evidence"}
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddVideoEvidenceForm;
