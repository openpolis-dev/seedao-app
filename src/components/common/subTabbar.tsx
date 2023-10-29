import styled from 'styled-components';
import { useState } from 'react';

type TabKeyType = string | number;

export interface ITabItem {
  key: TabKeyType;
  title: string;
  [k: string]: any;
}

interface IProps {
  defaultActiveKey: TabKeyType;
  tabs: ITabItem[];
  onSelect?: (v: TabKeyType) => void;
  [k: string]: any;
}

export default function SubTabbar({ defaultActiveKey, tabs, onSelect, ...rest }: IProps) {
  const [currentKey, setCurrentKey] = useState<TabKeyType>(defaultActiveKey || 0);

  const handleSelect = (k: TabKeyType) => {
    setCurrentKey(k);
    onSelect && onSelect(k);
  };

  return (
    <SubTabbarStyle {...rest}>
      {tabs.map((item) => (
        <li key={item.key} onClick={() => handleSelect(item.key)} className={item.key === currentKey ? 'selected' : ''}>
          {item.title}
        </li>
      ))}
    </SubTabbarStyle>
  );
}

const SubTabbarStyle = styled.ul`
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  gap: 40px;
  color: var(--bs-body-color);
  li {
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    &.selected {
      color: var(--bs-body-color_active);
    }
  }

  flex-wrap: nowrap;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
`;
