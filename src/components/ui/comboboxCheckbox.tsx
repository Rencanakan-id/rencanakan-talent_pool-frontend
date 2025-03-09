'use client';

import * as React from 'react';
import { ChevronsUpDown, X } from 'lucide-react';
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
import { Checkbox } from './checkbox';
import { useState } from 'react';
import { Typography } from '../atoms/typography';
import { Badge } from './badge';

type Option = {
  value: string;
  label: string;
};

type ComboboxCheckBoxProps = {
  placeholder?: string;
  label?: string;
  emptyMessage?: string;
  data?: Option[];
  width?: string;
  className?: string;
  onChange?: (values: string[]) => void;
  defaultValues?: string[];
  maxSelection?: number; // New prop to limit selection
};

export function ComboboxCheckBox({
  data = [],
  placeholder = 'Search',
  label = 'Selection',
  emptyMessage = 'No options found',
  width = '368px',
  className = '',
  onChange,
  defaultValues = [],
  maxSelection,
}: Readonly<ComboboxCheckBoxProps>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [selected, setSelected] = useState<string[]>(defaultValues);

  const toggleSelection = (optionValue: string, _optionLabel: string, checked: boolean) => {
    setSelected((prev) => {
      let updated: string[] = [];

      if (checked) {
        if (maxSelection && prev.length >= maxSelection) {
          updated = [...prev.slice(1), optionValue];
        } else {
          updated = [...prev, optionValue];
        }
      } else {
        updated = prev.filter((item) => item !== optionValue);
      }

      // Update the display text
      const selectedLabels = data
        .filter((option) => updated.includes(option.value))
        .map((option) => option.label);
      setValue(selectedLabels.join(', '));

      if (onChange) {
        onChange(updated);
      }

      return updated;
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative w-full">
        <PopoverTrigger className="w-full">
          <Button
            variant="primary-outline"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls="combobox-options"
            aria-labelledby={`${label}-label`}
            aria-autocomplete="list"
            className={`relative h-[50px] w-full justify-between rounded-[2px] p-0 ${className} active:bg-transparent active:text-rencanakan-dark-gray hover:text-rencanakan-dark-gray border-rencanakan-base-gray hover:border-rencanakan-base-gray focus:border-rencanakan text-rencanakan-dark-gray h-10 bg-transparent px-4 font-normal hover:scale-[1.001] hover:bg-transparent hover:shadow-sm focus:outline-none active:scale-100`}
            icon={<ChevronsUpDown className="opacity-50" />}
            iconPosition="end"
          >
            <Typography variant="p4" className="text-xs text-gray-500">
              {value || `Pilih ${label}`}
            </Typography>
          </Button>
          <Typography
            variant="p4"
            id={`${label}-label`}
            className="text-rencanakan-dark-gray absolute -top-2 left-3 bg-white text-gray-500"
          >
            {label}
          </Typography>
        </PopoverTrigger>
      </div>
      <PopoverContent className="p-0 border-rencanakan-light-gray" id="combobox-options" role="listbox" style={{ width }}>
        <Command>
          <div className="flex h-full items-center">
            <Typography variant="p5" className="flex items-center p-2">
              Terpilih:
            </Typography>
            {maxSelection && (
              <Typography variant="p5" className="text-gray-500">
                (Maks. {maxSelection})
              </Typography>
            )}
          </div>
          {selected.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 p-2">
              {selected.map((selectedValue) => {
                const option = data.find((item) => item.value === selectedValue);
                return option ? (
                  <Badge
                    key={selectedValue}
                    variant="location"
                    className="flex h-[25px] w-auto min-w-[93px] items-center justify-center space-x-1"
                  >
                    <Typography variant="p3" className="m-1 text-blue-900">
                      {option.label}
                    </Typography>
                    <button
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelection(option.value, option.label, false);
                      }}
                    >
                      <X className="h-4 w-4 cursor-pointer text-blue-900" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          ) : null}

          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {data.map((option) => (
                <CommandItem key={option.value} value={option.value}>
                  <div className="m-2 flex w-full items-center gap-4">
                    <Checkbox
                      id={option.value}
                      checked={selected.includes(option.value)}
                      onCheckedChange={(checked) =>
                        toggleSelection(option.value, option.label, checked === true)
                      }
                      disabled={
                        !!(
                          maxSelection &&
                          selected.length >= maxSelection &&
                          !selected.includes(option.value)
                        )
                      }
                    />
                    <label htmlFor={option.value} className="cursor-pointer">
                      {option.label}
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
