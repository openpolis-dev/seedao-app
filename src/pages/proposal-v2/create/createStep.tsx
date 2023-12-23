import styled from 'styled-components';

import { Template } from '@seedao/proposal';
import initialItems from './json/initialItem';
import DataSource from './json/datasource.json';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { MdEditor } from 'md-editor-rt';

const Box = styled.ul``;

const ItemBox = styled.div`
  margin-bottom: 20px;
`;

const TitleBox = styled.div`
  background: #f1f1f1;
  padding: 20px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  box-sizing: border-box;
`;

export default function CreateStep() {
  const childRef = useRef(null);
  const [title, setTitle] = useState('');
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    let arr = [
      {
        title: 'Background',
        content: 'This is a background block',
      },
      {
        title: 'Detail',
        content: 'This is a detail block',
      },
    ];
    setList([...arr]);
  }, []);

  const handleInput = (e: ChangeEvent) => {
    const { value } = e.target as HTMLInputElement;
    setTitle(value);
  };

  const handleFormSubmit = (data: any) => {
    console.log({
      title,
      content_blocks: list,
      components: data,
    });
  };

  const handleText = (value: any, index: number) => {
    let arr = [...list];
    arr[index].content = value;
    setList([...arr]);
  };

  const AllSubmit = () => {
    (childRef.current as any).submitForm();
  };
  return (
    <Box>
      <Template
        DataSource={DataSource}
        operate="edit"
        initialItems={initialItems}
        BeforeComponent={
          <ItemBox>
            <TitleBox>提案标题</TitleBox>
            <input type="text" value={title} onChange={handleInput} />
          </ItemBox>
        }
        AfterComponent={
          <div>
            {list.map((item, index: number) => (
              <ItemBox key={`block_${index}`}>
                <TitleBox>{item.title}</TitleBox>

                <MdEditor
                  modelValue={item.content}
                  editorId={`block_${index}`}
                  onChange={(val) => handleText(val, index)}
                />

                {/*<MarkdownEditor value={item.content} onChange={(val)=>handleText(val,index)} />*/}
              </ItemBox>
            ))}
          </div>
        }
        ref={childRef}
        onSubmitData={handleFormSubmit}
      />
      <button onClick={() => AllSubmit()}>after</button>
    </Box>
  );
}
