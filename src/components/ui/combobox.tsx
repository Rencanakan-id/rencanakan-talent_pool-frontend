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
  value?: string;
  onChange?: (value: string) => void;
};

export function Combobox({
  data = [],
  placeholder = 'Search...',
  label = 'Selection',
  emptyMessage = 'No options found',
  width = '100%',
  className = '',
  value: propValue = '',
  onChange,
}: Readonly<ComboboxProps>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(propValue);

  React.useEffect(() => {
    setValue(propValue);
  }, [propValue]);

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
            aria-haspopup="listbox"
            aria-controls="dropdown-list"
            aria-expanded={open}
            className={`relative h-[50px] w-full justify-between rounded-[2px] p-0 ${className} active:text-rencanakan-dark-gray hover:text-rencanakan-dark-gray border-rencanakan-base-gray hover:border-rencanakan-base-gray focus:border-rencanakan text-rencanakan-dark-gray h-10 bg-transparent px-3 font-normal hover:scale-[1.001] hover:bg-transparent hover:shadow-sm focus:outline-none active:scale-100 active:bg-transparent sm:px-3 md:px-3`}
            icon={
              <ChevronsUpDown
                className={`transition-transform duration-200 ${open ? 'rotate-180' : ''} opacity-50`}
              />
            }
            iconPosition="end"
          >
            <Typography
              variant="p4"
              className={`${value ? 'text-rencanakan-type-black' : 'text-rencanakan-dark-gray'}`}
            >
              {value ? data.find((option) => option.value === value)?.label : `Pilih ${label}`}
            </Typography>
          </Button>
          <Typography
            variant="p5"
            className="text-rencanakan-dark-gray absolute -top-2 left-3 bg-white px-1"
          >
            {label}
          </Typography>
        </PopoverTrigger>
      </div>
      <PopoverContent
        className="border-rencanakan-light-gray w-full p-0 pt-2 bg-white"
        style={{ width: width }}
      >
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {data.map((option) => (
                <CommandItem key={option.value} value={option.value} onSelect={handleSelect}>
                  <div className="flex w-full items-center gap-4">
                    <span>{option.label}</span>
                    <Check
                      className={cn(
                        'ml-auto transition-opacity duration-200',
                        value === option.value ? 'opacity-100' : 'opacity-0'
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
