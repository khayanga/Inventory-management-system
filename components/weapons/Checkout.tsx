"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  militaryId: z.string().min(1, "Military ID is required"), 
  purpose: z.string().min(1, "Purpose is required"),
  
});

export const CheckoutForm = ({ 
  weaponId,
  onCheckout,
  onCancel 
}: { 
  weaponId: string;
  onCheckout: (values: any) => Promise<void>;
  onCancel: () => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      militaryId: "", // Changed from officerId to militaryId
      purpose: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await onCheckout({
      weaponId,
      ...values
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="militaryId" // Changed from officerId to militaryId
          render={({ field }) => (
            <FormItem>
              <FormLabel>Officer Military ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter officer's military ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose</FormLabel>
              <FormControl>
                <Input placeholder="Enter purpose for checkout" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Checkout Weapon</Button>
        </div>
      </form>
    </Form>
  );
};