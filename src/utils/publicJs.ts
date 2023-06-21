import { ethers } from 'ethers';

const AddressToShow = (address: string) => {
  if (!address) return '...';

  const frontStr = address.substring(0, 4);

  const afterStr = address.substring(address.length - 4, address.length);

  return `${frontStr}...${afterStr}`;
};

export default { AddressToShow };
