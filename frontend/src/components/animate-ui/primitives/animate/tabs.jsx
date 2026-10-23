'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Highlight, HighlightItem } from '@/components/animate-ui/primitives/effects/highlight';
import { getStrictContext } from '@/lib/get-strict-context';
import { Slot } from '@/components/animate-ui/primitives/animate/slot';

const [TabsProvider, useTabs] = getStrictContext('TabsContext');

export function Tabs({ defaultValue, value, onValueChange, children, ...props }) {
  const [activeValue, setActiveValue] = React.useState(defaultValue);
  const triggersRef = React.useRef(new Map());
  const initialSet = React.useRef(false);
  const isControlled = value !== undefined;

  React.useEffect(() => {
    if (!isControlled && activeValue === undefined && triggersRef.current.size > 0 && !initialSet.current) {
      const firstTab = triggersRef.current.keys().next().value;
      if (firstTab !== undefined) {
        setActiveValue(firstTab);
        initialSet.current = true;
      }
    }
  }, [activeValue, isControlled]);

  const registerTrigger = React.useCallback((val, node) => {
    if (node) {
      triggersRef.current.set(val, node);
      if (!isControlled && activeValue === undefined && !initialSet.current) {
        setActiveValue(val);
        initialSet.current = true;
      }
    } else {
      triggersRef.current.delete(val);
    }
  }, [activeValue, isControlled]);

  const handleValueChange = React.useCallback((val) => {
    if (!isControlled) setActiveValue(val);
    else onValueChange?.(val);
  }, [isControlled, onValueChange]);

  const currentTab = isControlled ? value : activeValue;

  return (
    <TabsProvider
      value={{
        activeValue: currentTab,
        handleValueChange,
        registerTrigger,
      }}
    >
      <div data-slot="tabs" {...props}>
        {children}
      </div>
    </TabsProvider>
  );
}

export function TabsHighlight({
  transition = { type: 'spring', stiffness: 600, damping: 36, mass: 0.5 },
  ...props
}) {
  const { activeValue } = useTabs();

  return (
    <Highlight
      data-slot="tabs-highlight"
      controlledItems
      value={activeValue}
      transition={transition}
      click={false}
      {...props}
    />
  );
}

export function TabsList(props) {
  return <div role="tablist" data-slot="tabs-list" {...props} />;
}

export function TabsHighlightItem(props) {
  return <HighlightItem data-slot="tabs-highlight-item" {...props} />;
}

export function TabsTrigger({ ref, value, asChild = false, ...props }) {
  const { activeValue, handleValueChange, registerTrigger } = useTabs();
  const localRef = React.useRef(null);

  React.useEffect(() => {
    registerTrigger(value, localRef.current);
    return () => registerTrigger(value, null);
  }, [value, registerTrigger]);

  const Component = asChild ? Slot : motion.button;

  return (
    <Component
      ref={localRef}
      data-slot="tabs-trigger"
      role="tab"
      type="button"
      onClick={() => handleValueChange(value)}
      data-state={activeValue === value ? 'active' : 'inactive'}
      {...props}
    />
  );
}

export function TabsContents({
  children,
  transition = {
    type: 'spring',
    stiffness: 550,
    damping: 36,
    mass: 0.5,
  },
  ...props
}) {
  const { activeValue } = useTabs();
  const childrenArray = React.Children.toArray(children);
  const activeIndex = childrenArray.findIndex(
    (child) =>
      React.isValidElement(child) &&
      typeof child.props === 'object' &&
      child.props !== null &&
      'value' in child.props &&
      child.props.value === activeValue
  );

  const containerRef = React.useRef(null);
  const itemRefs = React.useRef([]);
  const [height, setHeight] = React.useState(0);

  const measure = React.useCallback((index) => {
    const pane = itemRefs.current[index];
    const container = containerRef.current;
    if (!pane || !container) return 0;

    const target = pane.firstElementChild || pane;
    const scrollH = target.scrollHeight || 0;
    const offsetH = target.offsetHeight || 0;

    let rectH = target.getBoundingClientRect?.().height || 0;
    const zoomVal = parseFloat(getComputedStyle(document.documentElement).zoom || '1') || 1;
    if (zoomVal > 0 && zoomVal !== 1) {
      rectH = rectH / zoomVal;
    }

    const base = Math.max(scrollH, offsetH, rectH);
    const cs = getComputedStyle(container);
    const isBorderBox = cs.boxSizing === 'border-box';
    const paddingY =
      (parseFloat(cs.paddingTop || '0') || 0) +
      (parseFloat(cs.paddingBottom || '0') || 0);
    const borderY =
      (parseFloat(cs.borderTopWidth || '0') || 0) +
      (parseFloat(cs.borderBottomWidth || '0') || 0);

    return Math.ceil(base + (isBorderBox ? paddingY + borderY : 0) + 4);
  }, []);

  React.useEffect(() => {
    if (activeIndex >= 0) {
      const update = () => {
        const measured = measure(activeIndex);
        if (measured > 0) setHeight(measured);
      };
      update();
      const t1 = setTimeout(update, 50);
      const t2 = setTimeout(update, 200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [activeIndex, childrenArray.length, measure]);

  React.useEffect(() => {
    if (activeIndex < 0) return;
    const pane = itemRefs.current[activeIndex];
    if (!pane || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      const measured = measure(activeIndex);
      if (measured > 0) setHeight(measured);
    });
    ro.observe(pane);
    if (pane.firstElementChild) ro.observe(pane.firstElementChild);
    return () => ro.disconnect();
  }, [activeIndex, measure]);

  const safeIndex = activeIndex >= 0 ? activeIndex : 0;

  return (
    <motion.div
      ref={containerRef}
      data-slot="tabs-contents"
      style={{ overflow: 'hidden' }}
      animate={height > 0 ? { height } : undefined}
      transition={transition}
      {...props}
    >
      <motion.div
        className="flex items-start"
        animate={{ x: safeIndex * -100 + '%' }}
        transition={transition}
      >
        {childrenArray.map((child, index) => (
          <div
            key={index}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="w-full shrink-0"
          >
            {child}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export function TabsContent({ value, style, asChild = false, ...props }) {
  const { activeValue } = useTabs();
  const isActive = activeValue === value;
  const Component = asChild ? Slot : motion.div;

  return (
    <Component
      role="tabpanel"
      data-slot="tabs-content"
      style={{ ...style }}
      initial={{ opacity: 0.8 }}
      animate={{
        opacity: isActive ? 1 : 0.4,
      }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
      {...props}
    />
  );
}

export { useTabs };
