'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { locations } from '@/data/location';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { X, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from './checkbox';
import { useState } from 'react';
import { Typography } from '../atoms/typography';
import { Badge } from './badge';

export function ComboboxCheckBox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const toggleLocation = (location: string, checked: boolean) => {
    let updated = [];
    setSelected((prev) => {
      if (location == 'Semua Lokasi') {
        updated = !checked ? [] : ['Semua Lokasi'];
      } else {
        updated = !checked
          ? prev.filter((item) => item !== location)
          : [...prev.filter((item) => item !== 'Semua Lokasi'), location];
      }

      setValue(updated.join(', '));

      return updated;
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="relative">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex h-[50px] w-[368px] justify-between rounded-[12px] p-0"
          icon={<ChevronsUpDown className="opacity-50" />}
          iconPosition="end"
        >
          <Typography variant="p4" className="text-xs text-gray-500">
            {value  || 'Pilih kota'}
          </Typography>
        </Button>
        <Typography
          variant="p4"
          className="text-rencanakan-dark-gray absolute -top-2 left-3 bg-white text-gray-500"
        >
          Bersedia Ditempatkan Dimana
        </Typography>
      </PopoverTrigger>
      <PopoverContent className="w-[368px] p-0">
        <Command>
          <div className="flex h-full items-center">
            <Typography variant="p5" className="flex items-center p-2">
              Terpilih:
            </Typography>
          </div>
          {selected.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 p-2">
              {selected.map((location) => (
                <Badge
                  key={location}
                  variant="location"
                  className="flex h-[25px] w-auto min-w-[93px] items-center justify-center space-x-1"
                >
                  <Typography variant="p3" className="m-1 text-blue-900">
                    {location}
                  </Typography>
                  <button
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLocation(location, false);
                    }}
                  >
                    <X className="h-4 w-4 cursor-pointer text-blue-900" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : null}

          <CommandInput placeholder="Lokasi" />
          <CommandList>
            <CommandEmpty>Lokasi tidak ditemukan</CommandEmpty>
            <CommandGroup>
              {locations.map((location) => (
                <CommandItem key={location.value} value={location.value}>
                  <div className="m-2 flex w-full items-center gap-4">
                    <Checkbox
                      id={location.label}
                      checked={selected.includes(location.label)}
                      onCheckedChange={(checked) =>
                        toggleLocation(location.label, checked === true)
                      }
                    />
                    <label htmlFor={location.label} className="cursor-pointer">
                      {location.label}
                    </label>
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
