import React from 'react';

/**
 * Creates a type-safe context provider and hook pair.
 * Ensures that the hook is only consumed within its corresponding provider.
 */
export function getStrictContext(name) {
  const Context = React.createContext(undefined);

  function useStrictContext() {
    const context = React.useContext(Context);
    if (!context) {
      throw new Error(`use${name} must be used within a ${name}Provider`);
    }
    return context;
  }

  return [Context.Provider, useStrictContext];
}
