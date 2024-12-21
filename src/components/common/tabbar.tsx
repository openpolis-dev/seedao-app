import styled from 'styled-components';
import { useEffect, useState } from 'react';

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
}

export default function Tabbar({ defaultActiveKey, tabs, onSelect }: IProps) {
  const [currentKey, setCurrentKey] = useState<TabKeyType>(defaultActiveKey || 0);

  useEffect(() => {
    setCurrentKey(defaultActiveKey);
  }, [defaultActiveKey]);

  const handleSelect = (k: TabKeyType) => {
    setCurrentKey(k);
    onSelect && onSelect(k);
  };

  return (
    <TabbarStyle>
      {tabs.map((item) => (
        <li key={item.key} onClick={() => handleSelect(item.key)} className={currentKey.toString().indexOf(item.key.toString()) > -1 ? 'selected' : ''}>
          {item.title}
        </li>
      ))}
    </TabbarStyle>
  );
}

const TabbarStyle = styled.ul`
  display: flex;
  align-items: center;
  font-size: 14px;
  li {
    border-radius: 17px;
    height: 34px;
    line-height: 34px;
    padding-inline: 23px;
    &.selected {
      background-color: var(--bs-primary);
      color: #fff;
      font-size: 18px;
    }
    cursor: pointer;
  }

  flex-wrap: nowrap;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
`;
