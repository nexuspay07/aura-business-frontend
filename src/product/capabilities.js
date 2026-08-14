export function hasCapability(capabilities, capability) {
  return Array.isArray(capabilities) && capabilities.includes(capability);
}

export function canAccessRoute(capabilities, capability) {
  return !capability || hasCapability(capabilities, capability);
}
