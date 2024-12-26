'use client';

import { ChangeEvent, useState } from 'react';

import { Check } from 'lucide-react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import useDebounce from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

import { Input } from './input';

interface AutoCompleteResult {
  value: string;
  label: string;
}

export function AutoComplete(props: {
  textFieldProps: Omit<Parameters<typeof Input>[0], 'value'>;
  onFetch: (text: string) => Promise<AutoCompleteResult[]>;
  onChoose: (value: string) => void;
}) {
  const debounce = useDebounce(300);

  const [results, setResults] = useState<AutoCompleteResult[]>([]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.textFieldProps.onChange?.(e);
    debounce(() => {
      const text = e.target.value;
      props.onFetch(text).then((res) => {
        setResults(res);
      });
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          {...props.textFieldProps}
          value={results.find((r) => r.value === value)?.label}
        />
      </PopoverTrigger>
      <PopoverContent
        style={{ width: 'var(--radix-popover-trigger-width)' }}
        className="p-0"
      >
        <Command>
          <CommandInput
            placeholder="Search User"
            className="h-9"
            onInput={onChange}
          />
          <CommandList>
            <CommandEmpty>No result found.</CommandEmpty>
            <CommandGroup>
              {results.map((result) => (
                <CommandItem
                  key={result.value}
                  value={result.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                    props.onChoose(currentValue);
                  }}
                >
                  {result.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === result.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
