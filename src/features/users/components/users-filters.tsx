"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon } from "lucide-react";
import {
  usersFiltersSchema,
  type UsersFiltersValues,
} from "@/features/users/schemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UsersFiltersProps = {
  values: UsersFiltersValues;
  onChange: (values: UsersFiltersValues) => void;
};

export function UsersFilters({ values, onChange }: UsersFiltersProps) {
  const { control, register, watch } = useForm<UsersFiltersValues>({
    resolver: zodResolver(usersFiltersSchema),
    defaultValues: values,
  });

  useEffect(() => {
    const subscription = watch((formValues) => {
      const parsed = usersFiltersSchema.safeParse(formValues);
      if (parsed.success) {
        onChange(parsed.data);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <form className="grid gap-3 rounded-xl border border-border/70 bg-card/60 p-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
      <div className="grid gap-1.5">
        <Label htmlFor="users-search">Search</Label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="users-search"
            className="pl-8"
            placeholder="Name or email..."
            {...register("search")}
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="users-role">Role</Label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => {
                if (value) field.onChange(value);
              }}
            >
              <SelectTrigger id="users-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All roles</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super admin</SelectItem>
                <SelectItem value="ADMIN_GENERAL">Admin General</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </form>
  );
}
