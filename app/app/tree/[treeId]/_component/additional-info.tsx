"use client";

import { useState, useTransition } from "react";
import { Pen, Check, X } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import useCurrentSession from "@/components/providers/session-provider";
import { editTreeInfo } from "@/actions/tree/edit-tree-info";
import { editTreeInfoSchema, EditTreeInfoSchema } from "@/lib/validations/tree";
import { LoadingAnimation } from "@/components/common/loading-animation";

type EditableAdditionalInfoProps = {
  initialInfo: string;
  treeId: string;
  planterId: string;
  verificationStarted: boolean;
};

export function AdditionalInfo({
  initialInfo,
  planterId,
  treeId,
  verificationStarted,
}: EditableAdditionalInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { accessToken, session } = useCurrentSession();
  const [isPending, startTransition] = useTransition();

  const isPlanter = session.id === planterId;
  const isAuthorized = isPlanter && !verificationStarted;

  // 1. Define your form.
  const form = useForm<EditTreeInfoSchema>({
    resolver: zodResolver(editTreeInfoSchema),
    defaultValues: {
      accessToken,
      additionalInfo: initialInfo,
      treeId,
    },
  });

  function handleSave(values: EditTreeInfoSchema) {
    startTransition(async () => {
      try {
        const result = await editTreeInfo(values);

        if (result.success) {
          toast.success("Tree info updated successfully");
          setIsEditing(false);
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

  return (
    <div className="space-y-2 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Additional Information</h3>
        {isAuthorized && !isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Pen className="h-4 w-4" />
          </Button>
        )}
        {isAuthorized && isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    disabled={!isEditing || isPending}
                    className={isEditing ? "" : "opacity-70"}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Any info that will help with verification.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {isEditing && (
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <LoadingAnimation />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}{" "}
              Save
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}
