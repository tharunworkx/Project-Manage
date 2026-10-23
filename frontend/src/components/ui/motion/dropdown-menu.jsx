import * as React from "react";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

const DropdownMenuHighlightContext = React.createContext(null);

function DropdownMenu({
    ...props
}) {
    return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
    ...props
}) {
    return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({ asChild, children, render, ...props }) {
    if (asChild && React.isValidElement(children)) {
        return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" render={children} {...props} />;
    }
    return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" render={render} {...props}>{children}</MenuPrimitive.Trigger>;
}

function DropdownMenuContent({
    align = "start",
    alignOffset = 0,
    side = "bottom",
    sideOffset = 4,
    transition = { type: "spring", stiffness: 380, damping: 26, mass: 0.8 },
    className,
    children,
    ...props
}) {
    const parentHighlightContext = React.useContext(DropdownMenuHighlightContext);

    const generatedLayoutId = React.useId();
    const highlightLayoutId = parentHighlightContext?.highlightLayoutId ?? generatedLayoutId;

    const [localActiveItemId, setLocalActiveItemId] = React.useState(null);
    const timeoutRef = React.useRef(null);

    const setActiveItem =
        parentHighlightContext?.setActiveItem ??
        React.useCallback((id) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setLocalActiveItemId(id);
        }, []);

    const clearActiveItemWithDelay =
        parentHighlightContext?.clearActiveItemWithDelay ??
        React.useCallback(() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setLocalActiveItemId(null);
            }, 180);
        }, []);

    const activeItemId = parentHighlightContext ? parentHighlightContext.activeItemId : localActiveItemId;

    const highlightValue = parentHighlightContext ?? {
        highlightLayoutId,
        activeItemId,
        setActiveItem,
        clearActiveItemWithDelay,
    };

    return (
        <MenuPrimitive.Portal keepMounted>
            <MenuPrimitive.Positioner
                className="isolate z-500 outline-none"
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}>
                <MenuPrimitive.Popup
                    data-slot="dropdown-menu-content"
                    {...props}
                    render={(popupProps, state) => (
                        <AnimatePresence initial={false}>
                            {state.open && (
                                <motion.div
                                    {...popupProps}
                                    key="dropdown-menu-content"
                                    initial={{
                                        opacity: 0,
                                        scale: 0.94,
                                        y: side === "bottom" ? -8 : side === "top" ? 8 : 0,
                                        x: side === "right" ? -12 : side === "left" ? 12 : 0,
                                    }}
                                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.94,
                                        y: side === "bottom" ? -6 : side === "top" ? 6 : 0,
                                        x: side === "right" ? -8 : side === "left" ? 8 : 0,
                                    }}
                                    transition={transition}
                                    className={cn(
                                        "border border-border/80 bg-popover text-popover-foreground z-50 flex max-h-(--available-height) w-(--anchor-width) min-w-44 origin-(--transform-origin) flex-col gap-0.5 overflow-x-hidden overflow-y-auto rounded-xl p-1.5 shadow-xl ring-1 ring-black/5 dark:ring-white/10 outline-none backdrop-blur-md",
                                        className,
                                    )}>
                                    <DropdownMenuHighlightContext.Provider value={highlightValue}>
                                        <div onPointerLeave={clearActiveItemWithDelay} className="flex flex-col gap-0.5">
                                            {children}
                                        </div>
                                    </DropdownMenuHighlightContext.Provider>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                />
            </MenuPrimitive.Positioner>
        </MenuPrimitive.Portal>
    );
}

function DropdownMenuGroup({
    className,
    ...props
}) {
    return <MenuPrimitive.Group data-slot="dropdown-menu-group" className={cn("flex flex-col gap-0.5", className)} {...props} />;
}

function DropdownMenuLabel({
    className,
    inset,
    ...props
}) {
    return (
        <MenuPrimitive.Group>
            <MenuPrimitive.GroupLabel
                data-slot="dropdown-menu-label"
                data-inset={inset}
                className={cn("text-muted-foreground px-2.5 py-1.5 text-xs font-semibold data-inset:pl-8", className)}
                {...props}
            />
        </MenuPrimitive.Group>
    );
}

function DropdownMenuItem({
    className,
    inset,
    variant = "default",
    children,
    render: customRender,
    asChild,
    onClick,
    onSelect,
    ...props
}) {
    const highlightContext = React.useContext(DropdownMenuHighlightContext);
    const itemId = React.useId();
    const effectiveRender = customRender || (asChild && React.isValidElement(children) ? children : undefined);
    const sanitizedClassName = className ? className.replace(/\b(?:[a-zA-Z0-9_-]+:)*hover:bg-\S+/g, '') : '';

    const handleClick = (e) => {
        onClick?.(e);
        onSelect?.(e);
    };

    return (
        <MenuPrimitive.Item
            data-slot="dropdown-menu-item"
            data-inset={inset}
            data-variant={variant}
            onClick={handleClick}
            {...props}
            render={(itemProps, state) => {
                const isCurrentActive = highlightContext?.activeItemId === itemId;

                const innerContent = (
                    <>
                        {isCurrentActive && highlightContext?.highlightLayoutId && (
                            <motion.div
                                layoutId={highlightContext.highlightLayoutId}
                                className={cn(
                                    "pointer-events-none absolute inset-0 z-0 rounded-lg",
                                    variant === "destructive"
                                        ? "bg-destructive/15 dark:bg-destructive/25"
                                        : "bg-slate-100 dark:bg-[#282E33]",
                                )}
                                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                            />
                        )}
                        <span className="relative z-10 flex w-full items-center gap-2">
                            {React.isValidElement(effectiveRender) && effectiveRender.props.children
                                ? effectiveRender.props.children
                                : children}
                        </span>
                    </>
                );

                const itemClassName = cn(
                    "group/dropdown-menu-item relative flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 text-slate-700 dark:text-[#DEE4EA]",
                    (state.highlighted || isCurrentActive) &&
                        (variant === "destructive" ? "text-destructive" : "text-slate-900 dark:text-[#DEE4EA]"),
                    sanitizedClassName,
                    React.isValidElement(effectiveRender) && effectiveRender.props.className,
                );

                if (React.isValidElement(effectiveRender)) {
                    return React.cloneElement(effectiveRender, {
                        ...itemProps,
                        ...effectiveRender.props,
                        onClick: (e) => {
                            if (itemProps.onClick) {
                                itemProps.onClick(e);
                            } else {
                                handleClick(e);
                            }
                            effectiveRender.props.onClick?.(e);
                        },
                        onPointerEnter: (e) => {
                            itemProps.onPointerEnter?.(e);
                            effectiveRender.props.onPointerEnter?.(e);
                            highlightContext?.setActiveItem(itemId);
                        },
                        onFocus: (e) => {
                            itemProps.onFocus?.(e);
                            effectiveRender.props.onFocus?.(e);
                            highlightContext?.setActiveItem(itemId);
                        },
                        className: itemClassName,
                        children: innerContent,
                    });
                }

                return (
                    <motion.div
                        {...itemProps}
                        onClick={(e) => {
                            if (itemProps.onClick) {
                                itemProps.onClick(e);
                            } else {
                                handleClick(e);
                            }
                        }}
                        onPointerEnter={(e) => {
                            itemProps.onPointerEnter?.(e);
                            highlightContext?.setActiveItem(itemId);
                        }}
                        onFocus={(e) => {
                            itemProps.onFocus?.(e);
                            highlightContext?.setActiveItem(itemId);
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={itemClassName}>
                        {innerContent}
                    </motion.div>
                );
            }}
        />
    );
}

function DropdownMenuSub({
    ...props
}) {
    return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
    className,
    inset,
    children,
    ...props
}) {
    const highlightContext = React.useContext(DropdownMenuHighlightContext);
    const itemId = React.useId();

    return (
        <MenuPrimitive.SubmenuTrigger
            data-slot="dropdown-menu-sub-trigger"
            data-inset={inset}
            {...props}
            render={(triggerProps, state) => {
                const isCurrentActive = highlightContext?.activeItemId === itemId;

                return (
                    <motion.div
                        {...triggerProps}
                        onPointerEnter={(e) => {
                            triggerProps.onPointerEnter?.(e);
                            highlightContext?.setActiveItem(itemId);
                        }}
                        onFocus={(e) => {
                            triggerProps.onFocus?.(e);
                            highlightContext?.setActiveItem(itemId);
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={cn(
                            "group/dropdown-menu-sub-trigger relative flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium outline-hidden select-none data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 text-slate-700 dark:text-[#DEE4EA]",
                            (state.highlighted || state.open || isCurrentActive) && "text-slate-900 dark:text-[#DEE4EA]",
                            className,
                        )}>
                        {isCurrentActive && highlightContext?.highlightLayoutId ? (
                            <motion.div
                                layoutId={highlightContext.highlightLayoutId}
                                className="bg-slate-100 dark:bg-[#282E33] pointer-events-none absolute inset-0 z-0 rounded-lg"
                                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                            />
                        ) : state.open ? (
                            <div className="bg-slate-100/70 dark:bg-[#282E33]/70 pointer-events-none absolute inset-0 z-0 rounded-lg" />
                        ) : null}
                        <span className="relative z-10 flex w-full items-center gap-2">{children}</span>
                        <ChevronRightIcon className="relative z-10 ml-auto" />
                    </motion.div>
                );
            }}
        />
    );
}

function DropdownMenuSubContent({
    align = "start",
    alignOffset = -3,
    side = "right",
    sideOffset = 4,
    className,
    ...props
}) {
    return (
        <DropdownMenuContent
            data-slot="dropdown-menu-sub-content"
            className={cn("w-auto min-w-[120px] shadow-lg", className)}
            align={align}
            alignOffset={alignOffset}
            side={side}
            sideOffset={sideOffset}
            {...props}
        />
    );
}

function DropdownMenuCheckboxItem({
    className,
    children,
    checked,
    ...props
}) {
    const highlightContext = React.useContext(DropdownMenuHighlightContext);
    const itemId = React.useId();

    return (
        <MenuPrimitive.CheckboxItem
            data-slot="dropdown-menu-checkbox-item"
            className={cn(
                "group/dropdown-menu-checkbox-item relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            checked={checked}
            {...props}
            render={(itemProps, state) => {
                const isCurrentActive = highlightContext?.activeItemId === itemId;

                return (
                    <motion.div
                        {...itemProps}
                        onPointerEnter={(e) => {
                            itemProps.onPointerEnter?.(e);
                            highlightContext?.setActiveItem(itemId);
                        }}
                        onFocus={(e) => {
                            itemProps.onFocus?.(e);
                            highlightContext?.setActiveItem(itemId);
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={cn(
                            "group/dropdown-menu-checkbox-item relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                            (state.highlighted || isCurrentActive) && "text-accent-foreground",
                            className,
                        )}>
                        {isCurrentActive && highlightContext?.highlightLayoutId && (
                            <motion.div
                                layoutId={highlightContext.highlightLayoutId}
                                className="bg-accent pointer-events-none absolute inset-0 z-0 rounded-sm"
                                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">{children}</span>
                        <span
                            className="pointer-events-none absolute right-2 z-10 flex items-center justify-center"
                            data-slot="dropdown-menu-checkbox-item-indicator">
                            <MenuPrimitive.CheckboxItemIndicator>
                                <motion.span
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                                    className="flex items-center justify-center">
                                    <CheckIcon />
                                </motion.span>
                            </MenuPrimitive.CheckboxItemIndicator>
                        </span>
                    </motion.div>
                );
            }}
        />
    );
}

function DropdownMenuRadioGroup({
    ...props
}) {
    return <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({
    className,
    children,
    ...props
}) {
    const highlightContext = React.useContext(DropdownMenuHighlightContext);
    const itemId = React.useId();

    return (
        <MenuPrimitive.RadioItem
            data-slot="dropdown-menu-radio-item"
            className={cn(
                "group/dropdown-menu-radio-item relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
            render={(itemProps, state) => {
                const isCurrentActive = highlightContext?.activeItemId === itemId;

                return (
                    <motion.div
                        {...itemProps}
                        onPointerEnter={(e) => {
                            itemProps.onPointerEnter?.(e);
                            highlightContext?.setActiveItem(itemId);
                        }}
                        onFocus={(e) => {
                            itemProps.onFocus?.(e);
                            highlightContext?.setActiveItem(itemId);
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={cn(
                            "group/dropdown-menu-radio-item relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                            (state.highlighted || isCurrentActive) && "text-accent-foreground",
                            className,
                        )}>
                        {isCurrentActive && highlightContext?.highlightLayoutId && (
                            <motion.div
                                layoutId={highlightContext.highlightLayoutId}
                                className="bg-accent pointer-events-none absolute inset-0 z-0 rounded-sm"
                                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">{children}</span>
                        <span
                            className="pointer-events-none absolute right-2 z-10 flex items-center justify-center"
                            data-slot="dropdown-menu-radio-item-indicator">
                            <MenuPrimitive.RadioItemIndicator>
                                <motion.span
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                                    className="flex items-center justify-center">
                                    <CheckIcon />
                                </motion.span>
                            </MenuPrimitive.RadioItemIndicator>
                        </span>
                    </motion.div>
                );
            }}
        />
    );
}

function DropdownMenuSeparator({
    className,
    ...props
}) {
    return (
        <MenuPrimitive.Separator
            data-slot="dropdown-menu-separator"
            className={cn("bg-border -mx-1 my-1 h-px", className)}
            {...props}
        />
    );
}

function DropdownMenuShortcut({
    className,
    ...props
}) {
    return (
        <span
            data-slot="dropdown-menu-shortcut"
            className={cn(
                "text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground ml-auto text-xs tracking-widest",
                className,
            )}
            {...props}
        />
    );
}

export {
    DropdownMenu,
    DropdownMenuPortal,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
};
