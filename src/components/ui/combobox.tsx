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
import { locations } from '@/data/static';

export function Combobox() {
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
              {value ? locations.find((location) => location.value === value)?.label : 'Pilih kota'}
            </Typography>
          </Button>
          <Typography
            variant="p4"
            className="text-rencanakan-dark-gray absolute -top-2 left-3 bg-white text-gray-500"
          >
            {value
              ? locations.find((location) => location.value === value)?.label
              : 'Lokasi saat ini'}
          </Typography>
        </PopoverTrigger>
      </div>

      <PopoverContent className="w-[368px] p-0">
        <Command>
          <CommandInput placeholder="Lokasi" />
          <CommandList>
            <CommandEmpty>Lokasi tidak ditemukan</CommandEmpty>
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
