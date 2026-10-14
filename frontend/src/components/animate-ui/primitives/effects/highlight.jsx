'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

const HighlightContext = React.createContext(undefined);

export function useHighlight() {
  const context = React.useContext(HighlightContext);
  if (!context) {
    throw new Error('useHighlight must be used within a HighlightProvider');
  }
  return context;
}

export function Highlight({
  as: Component = 'div',
  children,
  value,
  defaultValue,
  onValueChange,
  className,
  style,
  transition = { type: 'spring', stiffness: 550, damping: 36, mass: 0.5 },
  hover = false,
  click = true,
  enabled = true,
  controlledItems = false,
  disabled = false,
  exitDelay = 0,
  mode = 'parent',
  containerClassName,
  ...props
}) {
  const localRef = React.useRef(null);
  const [activeValue, setActiveValue] = React.useState(value ?? defaultValue ?? null);
  const [boundsState, setBoundsState] = React.useState(null);
  const id = React.useId();

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveValue(value);
    }
  }, [value]);

  const safeSetActiveValue = (val) => {
    setActiveValue((prev) => {
      if (prev !== val) {
        onValueChange?.(val);
        return val;
      }
      return prev;
    });
  };

  const setBounds = React.useCallback((bounds) => {
    if (!localRef.current || !bounds) return;
    const containerRect = localRef.current.getBoundingClientRect();
    setBoundsState({
      top: bounds.top - containerRect.top,
      left: bounds.left - containerRect.left,
      width: bounds.width,
      height: bounds.height,
    });
  }, []);

  const clearBounds = React.useCallback(() => {
    setBoundsState(null);
  }, []);

  const contextValue = {
    mode,
    activeValue,
    setActiveValue: safeSetActiveValue,
    id,
    hover,
    click,
    className,
    style,
    transition,
    disabled,
    enabled,
    exitDelay,
    setBounds,
    clearBounds,
  };

  return (
    <HighlightContext.Provider value={contextValue}>
      <Component
        ref={localRef}
        data-slot="motion-highlight-container"
        style={{ position: 'relative', zIndex: 1, ...style }}
        className={cn('relative', containerClassName)}
        {...props}
      >
        <AnimatePresence initial={false}>
          {boundsState && (
            <motion.div
              data-slot="motion-highlight"
              animate={{
                top: boundsState.top,
                left: boundsState.left,
                width: boundsState.width,
                height: boundsState.height,
                opacity: 1,
              }}
              initial={{
                top: boundsState.top,
                left: boundsState.left,
                width: boundsState.width,
                height: boundsState.height,
                opacity: 0,
              }}
              exit={{
                opacity: 0,
                transition: {
                  ...transition,
                  delay: (exitDelay || 0) / 1000,
                },
              }}
              transition={transition}
              style={{ position: 'absolute', pointerEvents: 'none', zIndex: 0 }}
              className={className}
            />
          )}
        </AnimatePresence>
        {children}
      </Component>
    </HighlightContext.Provider>
  );
}

export function HighlightItem({
  as: Component = 'div',
  children,
  id,
  value,
  className,
  style,
  transition,
  disabled = false,
  asChild = false,
  ...props
}) {
  const {
    activeValue,
    setActiveValue,
    setBounds,
    clearBounds,
    hover,
    click,
    transition: contextTransition,
    id: contextId,
    className: contextClassName,
  } = useHighlight();

  const localRef = React.useRef(null);
  const childValue = value ?? id;
  const isActive = activeValue === childValue;
  const itemTransition = transition ?? contextTransition;

  React.useEffect(() => {
    if (isActive && localRef.current) {
      setBounds(localRef.current.getBoundingClientRect());
    }
  }, [isActive, setBounds]);

  const onMouseEnter = () => {
    if (hover && !disabled) setActiveValue(childValue);
  };

  const onMouseLeave = () => {
    if (hover && !disabled) {
      setActiveValue(null);
      clearBounds();
    }
  };

  const onClick = () => {
    if (click && !disabled) setActiveValue(childValue);
  };

  return (
    <Component
      ref={localRef}
      data-slot="tabs-highlight-item"
      data-value={childValue}
      data-state={isActive ? 'active' : 'inactive'}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={cn('relative', className)}
      style={style}
      {...props}
    >
      {/* Shared layoutId spring background for tab highlight */}
      {isActive && (
        <motion.div
          layoutId={`highlight-pill-${contextId}`}
          className={cn('absolute inset-0 rounded-lg pointer-events-none -z-10', contextClassName)}
          transition={itemTransition}
        />
      )}
      {children}
    </Component>
  );
}
