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
  type?: string;
  data?: Option[];
};

export function Combobox({ data = [], type }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        <PopoverTrigger>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="relative h-[50px] w-[368px] justify-between rounded-[12px] p-0"
            icon={<ChevronsUpDown className="opacity-50" />}
            iconPosition="end"
          >
            <Typography variant="p4" className="text-xs text-gray-500">
              {value ? data.find((point) => point.value === value)?.label : 'Pilih ' + type}
            </Typography>
          </Button>
          <Typography
            variant="p4"
            className="text-rencanakan-dark-gray absolute -top-2 left-3 bg-white text-gray-500"
          >
            {value ? data.find((point) => point.value === value)?.label : type + ' saat ini'}
          </Typography>
        </PopoverTrigger>
      </div>

      <PopoverContent className="w-[368px] p-0">
        <Command>
          <CommandInput placeholder={`${type}`} />
          <CommandList>
            <CommandEmpty> {`${type} tidak ditemukan`}</CommandEmpty>
            <CommandGroup>
              {data.map((point) => (
                <CommandItem
                  key={point.value}
                  value={point.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <div className="flex w-full items-center gap-4">
                    <span>{point.label}</span>
                    <Check
                      className={cn(
                        'mr-2 transition-opacity duration-200',
                        value === point.value ? 'opacity-100' : 'opacity-0'
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
