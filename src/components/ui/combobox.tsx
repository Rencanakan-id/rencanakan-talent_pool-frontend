"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const locations = [
  { value: "jakarta", label: "Jakarta" },
  { value: "bandung", label: "Bandung" },
  { value: "surabaya", label: "Surabaya" },
  { value: "medan", label: "Medan" },
  { value: "makassar", label: "Makassar" },
  { value: "makassar", label: "Makassar" },
  { value: "makassar", label: "Makassar" },
  { value: "makassar", label: "Makassar" },
  { value: "makassar", label: "Makassar" },
  { value: "makassar", label: "Makassar" },
  { value: "makassar", label: "Makassar" },
  { value: "makassar", label: "Makassar" },
  { value: "makassar", label: "Makassar" },
  
];

export function Combobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[368px] h-[50px] p-0 justify-between"
        >
          {value
            ? locations.find((location) => location.value === value)?.label
            : "Select location"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[368px]  p-0">
        <Command>
          <CommandInput placeholder="Current Location" />
          <CommandList>
            <CommandEmpty>No location found</CommandEmpty>
            <CommandGroup>
              {locations.map((location) => (
                <CommandItem
                  key={location.value}
                  value={location.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {location.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === location.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>

  )
}
