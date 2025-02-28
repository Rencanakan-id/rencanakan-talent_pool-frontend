'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const locations = [
  { value: 'jakarta', label: 'Jakarta' },
  { value: 'bandung', label: 'Bandung' },
  { value: 'surabaya', label: 'Surabaya' },
  { value: 'medan', label: 'Medan' },
  { value: 'makassar1', label: 'Makassar' },
  { value: 'makassar2', label: 'Makassar' },
  { value: 'makassar3', label: 'Makassar' },
  { value: 'makassar4', label: 'Makassar' },
  { value: 'makassar5', label: 'Makassar' },
  { value: 'makassar6', label: 'Makassar' },
  { value: 'makassar7', label: 'Makassar' },
  { value: 'makassar8', label: 'Makassar' },
  { value: 'makassar9', label: 'Makassar' },
];

export function Combobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-[50px] w-[368px] justify-between p-0"
        >
          {value
            ? locations.find((location) => location.value === value)?.label
            : 'Select location'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[368px] p-0">
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
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <div className="flex w-full items-center gap-4">
                    <span>{location.label}</span>
                    <Check
                      className={cn(
                        'mr-2 transition-opacity duration-200',
                        value === location.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
