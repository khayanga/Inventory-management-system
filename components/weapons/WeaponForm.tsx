"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { WeaponCondition } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

const weaponSchema = z.object({
  serialNumber: z.string().min(3),
  model: z.string().min(2),
  type: z.string().min(2),
  condition: z.nativeEnum(WeaponCondition),
  
});

export function WeaponForm({
  onSubmit,
  initialData,
}: {
  onSubmit: (values: z.infer<typeof weaponSchema>) => Promise<void>;
  initialData?: Partial<z.infer<typeof weaponSchema>>;
}) {
  const form = useForm<z.infer<typeof weaponSchema>>({
    resolver: zodResolver(weaponSchema),
    defaultValues: initialData || {
      serialNumber: "",
      model: "",
      type: "",
      condition: "EXCELLENT",
      
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="serialNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serial Number</FormLabel>
              <FormControl>
                <Input placeholder="WPN-1234" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input placeholder="M4A1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input placeholder="Assault Rifle" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condition</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Condition" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(WeaponCondition).map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
                <FormMessage />
              </Select>
            </FormItem>
          )}
        />
        {/* <FormField
                control={form.control}
                name="dateAcquired"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Date Acquired</FormLabel>
                    <FormControl>
                    <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            /> */}

        <Button type="submit" className="w-full">
          {initialData ? "Update Weapon" : "Add Weapon"}
        </Button>
      </form>
    </Form>
  );
}
