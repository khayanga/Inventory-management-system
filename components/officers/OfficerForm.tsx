"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MilitaryRank } from "@prisma/client";
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

const officerSchema = z.object({
  name: z.string().min(3),
  rank: z.nativeEnum(MilitaryRank),
  unit: z.string().min(2),
  militaryId: z.string().min(2),
});

const OfficerForm = ({
  onSubmit,
  initialData,
}: {
  onSubmit: (values: z.infer<typeof officerSchema>) => Promise<void>;
  initialData?: Partial<z.infer<typeof officerSchema>>;
}) => {
  const form = useForm<z.infer<typeof officerSchema>>({
    resolver: zodResolver(officerSchema),
    defaultValues: initialData || {
      name: "",
      rank: "Sergeant",
      unit: "",
      militaryId: "",
    },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rank"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Military Rank</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a rank" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(MilitaryRank).map((rank) => (
                    <SelectItem key={rank} value={rank}>
                      {rank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <Input placeholder="Unit" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="militaryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Military ID</FormLabel>
              <FormControl>
                <Input placeholder="Military ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full">Submit</Button>

      </form>
    </Form>
  )
  
};

export default OfficerForm;
