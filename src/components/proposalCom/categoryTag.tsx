import styled from 'styled-components';

const CategoryTag = styled.div`
  display: inline-block;
  border-radius: 4px;
  border: 1px solid var(--proposal-tag-border);
  color: var(--bs-body-color_active);
  font-size: 12px;
  background: var(--line-home);
  padding: 0 16px;
  line-height: 24px;
  text-align: center;
`;

export default CategoryTag;

export const formatCategory = (name: string) => {
  if (name.includes('节点共识大会')) {
    return '公共项目';
  }
  if (name.includes('市政厅联席会议')) {
    return '市政厅联席会议';
  }
  return name;
};
