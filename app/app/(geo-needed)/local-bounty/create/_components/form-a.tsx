"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { toast } from "sonner";

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
import { formASchema } from "@/lib/validations/local-bounty/create";
import { CardFooter } from "@/components/ui/card";
import useBountyForm from "./bounty-form-context";
import { MapWithRadius } from "../../_components/map-with-radius";

export function FormA() {
  const { formState, setFormState, setFormStep } = useBountyForm();
  const { accessToken, centerLatitude, centerLongitude, radius } = formState;

  useEffect(() => {
    const toastId = toast.warning("Location Set & Points Deduction Notice 🛑", {
      description:
        "Once the location is set, it can't be changed. You'll be deducted 5 MitiMara points, claimable (3x) only after bounty deposit. 🌳💚",
      duration: 9000,
    });

    return () => {
      toast.dismiss(toastId);
    };
  }, []);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formASchema>>({
    resolver: zodResolver(formASchema),
    defaultValues: {
      accessToken,
      centerLatitude,
      centerLongitude,
      radius,
    },
  });

  const userFound = centerLatitude !== 0 && centerLongitude !== 0;

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formASchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setFormState((prevState) => {
      return { ...prevState, ...values };
    });
    setFormStep("information");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {userFound && (
          <MapWithRadius
            center={{ lat: centerLatitude, lng: centerLongitude }}
            radius={radius}
          />
        )}
        <FormField
          control={form.control}
          name="radius"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Radius (km)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => {
                    const parsedValue = Number.parseFloat(e.target.value);
                    const value = isNaN(parsedValue) ? 0 : parsedValue;

                    field.onChange(value);
                    setFormState((prevForm) => ({
                      ...prevForm,
                      radius: value,
                    }));
                  }}
                  step="0.1"
                />
              </FormControl>
              <FormDescription>
                Tree planting distance from bounty location center allowed
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <CardFooter className="flex justify-between">
          <Button type="submit" className="w-full" disabled={!userFound}>
            Next
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
