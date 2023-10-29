const AddressToShow = (address: string, num?: number) => {
  if (!address) return '';
  const n = num || 4;

  const frontStr = address.substring(0, n);

  const afterStr = address.substring(address.length - n, address.length);

  return `${frontStr}...${afterStr}`;
};

export default { AddressToShow };
