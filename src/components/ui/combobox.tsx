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
import { Typography } from '../atoms/typography';

type Option = {
  value: string;
  label: string;
};

type ComboboxProps = {
  placeholder?: string;
  label?: string;
  emptyMessage?: string;
  data?: Option[];
  width?: string;
  className?: string;
  onChange?: (value: string) => void;
};

export function Combobox({
  data = [],
  placeholder = "Search...",
  label = "Selection",
  emptyMessage = "No options found",
  width = "100%",
  className = "",
  onChange
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? '' : currentValue;
    setValue(newValue);
    if (onChange) onChange(newValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative w-full">
        <PopoverTrigger className="w-full">
            <Button
              variant="primary-outline"
              role="combobox"
              aria-expanded={open}
              className={`relative h-[50px] w-full justify-between rounded-[2px] p-0 ${className} active:scale-100 hover:scale-[1.001] px-4 h-10 hover:text-rencanakan-dark-gray hover:bg-transparent border-rencanakan-base-gray bg-transparent hover:border-rencanakan-base-gray hover:shadow-sm focus:border-rencanakan focus:outline-none font-normal text-rencanakan-dark-gray`}
              icon={<ChevronsUpDown className={`transition-transform duration-200 ${open ? 'rotate-180' : ''} opacity-50`} />}
              iconPosition="end"
            >
              <Typography variant="p4" className="text-xs">
                {value ? data.find((option) => option.value === value)?.label : `Pilih ${label}`}
              </Typography>
            </Button>
          <Typography
            variant="p4"
            className="text-rencanakan-dark-gray absolute -top-2 left-3 bg-white"
          >
            {label}
          </Typography>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-full p-0 pt-2" style={{ width: width }}>
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {data.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                >
                  <div className="flex w-full items-center gap-4">
                    <span>{option.label}</span>
                    <Check
                      className={cn(
                        'ml-auto transition-opacity duration-200',
                        value === option.value ? 'opacity-100' : 'opacity-0'
                      )} />
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