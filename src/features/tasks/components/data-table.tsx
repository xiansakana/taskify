"use client";
import {
  ColumnDef,
  flexRender,
  SortingState,
  getSortedRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        {/* Uncomment if wanted to implement tasks search  on the client side  */}
        {/* <Input
          placeholder="Filter tasks"
          value={
            (table
              .getColumn("name")
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table
              .getColumn("name")
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> */}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ?
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
