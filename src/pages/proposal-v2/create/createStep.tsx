import styled from 'styled-components';

import { Template } from '@seedao/proposal';
import initialItems from './json/initialItem';
import DataSource from './json/datasource.json';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { MdEditor } from 'md-editor-rt';
import { saveOrSubmitProposal } from 'requests/proposalV2';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useCheckMetaforoLogin from 'hooks/useCheckMetaforoLogin';

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
  const { dispatch } = useAuthContext();
  const checkMetaforoLogin = useCheckMetaforoLogin();

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

  const handleFormSubmit = async (data: any) => {
    console.log({
      title,
      content_blocks: list,
      components: data,
    });
    await checkMetaforoLogin();
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    saveOrSubmitProposal({
      title,
      proposal_category_id: 1, // TODO hardcode for test
      content_blocks: list,
      submit_to_metaforo: true,
    }).finally(() => {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
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
