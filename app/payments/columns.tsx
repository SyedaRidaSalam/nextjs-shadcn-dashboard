"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export type Payment = {
  id: string;
  amount: number;
  username: string;
  email: string;
  status: "pending" | "processing" | "success" | "failed";
};

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
      />
    ),
    //cell is how to render the content of this cell
    cell: ({ row }) => ( //fpr each row in the table 
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)} //updates the internal state    
        checked={row.getIsSelected()} //react re-renders after seeing the internal state and renders the checkbox based on the data
      />
    ),
  },
  {
    accessorKey: "username",
    header: "User",
  },
  {
    accessorKey: "email",
    header: ({ column }) => { //row.getValue("field") Get single column value
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status"); //get raw value from row 

      return (
        <div
          className={cn(
            `p-1 rounded-md w-max text-xs`,
            status === "pending" && "bg-yellow-500/40",
            status === "success" && "bg-green-500/40",
            status === "failed" && "bg-red-500/40"
          )}
        >
          {status as string}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", { //Intl = short for Internationalization API in JavaScript. NumberFormat = formats numbers according to locale rules.
        style: "currency",
        currency: "USD",
      }).format(amount);
// .format() is a method of Intl.NumberFormat
// You pass a number into it
// It returns a string formatted according to the rules you gave when creating formatter

      return <div className="text-right font-medium">{formatted}</div>;
    },
  }, //"en-US"This is the locale.
//"en-US" → English, United States
//"de-DE" → German, Germany
//"fr-FR" → French, France

// style can be:
// "decimal" → just a number, e.g., 1234.56 → 1,234.56
// "currency" → format as money, e.g., $1,234.56
// "percent" → percentage, e.g., 0.5 → 50%


// When style: "currency" is used, you must tell which currency:
// "USD" → $
// "EUR" → €
// "PKR" → ₨
// JS automatically:
// adds the symbol
// places it correctly
// formats decimal & commas
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original; //The raw row data you passed (Payment object) is stored in row.original.“Give me the entire original row data so I can use any field I want in this cell.”

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
            //   onClick={() => navigator.clipboard.writeText(payment.id)} writeText() is a method that copies text to clipboard payment.id → the text you want to copy
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];