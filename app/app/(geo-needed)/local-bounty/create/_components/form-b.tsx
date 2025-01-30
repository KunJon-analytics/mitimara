"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formBSchema } from "@/lib/validations/local-bounty/create";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { CardFooter } from "@/components/ui/card";
import useBountyForm from "./bounty-form-context";

export function FormB() {
  const { formState, setFormState, setFormStep } = useBountyForm();
  const { description, endDate, startDate, title, totalBounty } = formState;

  // 1. Define your form.
  const form = useForm<z.infer<typeof formBSchema>>({
    resolver: zodResolver(formBSchema),
    defaultValues: { description, endDate, startDate, title, totalBounty },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formBSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setFormState((prevState) => {
      return { ...prevState, ...values };
    });
    setFormStep("summary");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Give your local bounty a catchy title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Provide details about your local bounty challenge.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mr-2">Start </FormLabel>
              <FormControl>
                <DatePicker date={field.value} setDate={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mr-2">End </FormLabel>
              <FormControl>
                <DatePicker date={field.value} setDate={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalBounty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Bounty (Pi tokens)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => {
                    const parsedValue = Number.parseFloat(e.target.value);
                    const value = isNaN(parsedValue) ? 0 : parsedValue;

                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormDescription>
                Set the total amount of Pi tokens for this bounty.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <CardFooter className="flex justify-between gap-2">
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => setFormStep("location")}
            className="w-full"
          >
            Back
          </Button>
          <Button type="submit" className="w-full">
            Next
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
