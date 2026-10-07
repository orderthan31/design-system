import * as TabsPrimitive from '@radix-ui/react-tabs';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../lib/cn';
export const Tabs=TabsPrimitive.Root;
export const TabsContent=TabsPrimitive.Content;
export const TabsList=forwardRef<HTMLDivElement,ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(function TabsList({className,...props},ref){return <TabsPrimitive.List {...props} ref={ref} className={cn('flex flex-wrap gap-1 border-0 border-b border-solid border-g-line',className)}/>;});
export const TabsTrigger=forwardRef<HTMLButtonElement,ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(function TabsTrigger({className,...props},ref){return <TabsPrimitive.Trigger {...props} ref={ref} className={cn('min-h-11 border-0 border-b-2 border-solid border-transparent bg-transparent px-4 py-3 text-g-small font-medium text-g-soft data-[state=active]:border-g-action data-[state=active]:text-g-ink focus-visible:outline-2 focus-visible:outline-g-focus disabled:opacity-40',className)}/>;});
