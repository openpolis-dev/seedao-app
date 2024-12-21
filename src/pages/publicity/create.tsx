import styled, { css } from "styled-components";
import Form from 'react-bootstrap/Form';
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const { Check } = Form;

const CreateBox = styled.div`
    width: 576px;
    @media (max-width: 860px) {
        width: 480px;
    }
`;

const FormGroup = styled(Form.Group)`
  .checkbox {
    width: unset;
  }
  margin-bottom: 30px;
  .timer-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const FormLabel = styled(Form.Label)`
  margin-bottom: 14px;
  font-family: unset;
  .required {
    color: darkred;
  }
`;

const FormInput = styled(Form.Control)`
  min-width: 200px;
`;

const SubmitBox = styled.div`
  margin-top: 30px;
  button {
    min-width: 120px;
  }
`;

const FlexLine = styled.div`
  display: flex;
    align-items: center;
    margin-bottom: 16px;
    gap: 10px;
    
`

export default function CreatePublicity(){
  const { t } = useTranslation();
  const [radioValue, setRadioValue] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [href, setHref] = useState('');
  const [type, setType] = useState('create');

  const { pathname } = useLocation();
  const { id } = useParams();

  useEffect(() => {
    if(pathname.indexOf("edit")>-1){
      setType("edit")
    }else{
      setType("create")
    }

  }, [pathname]);

  const handleValueChange = () => {
    setRadioValue(!radioValue)
  }

  return <CreateBox>
    <Form>
      <FormGroup>
        <FormLabel>
          {t('Push.Title')} <span className="required">*</span>
        </FormLabel>
        <FormInput
          type="text"
          value={title} onChange={(e: any) => setTitle(e.target.value)}
        />
      </FormGroup>

      <FlexLine>
        <Check
          id="chooseTypeRadio1"
          type="radio"
          name="chooseTypeRadio"
          checked={radioValue}
          onChange={() => handleValueChange()}
          onClick={(e) => handleValueChange()}

        />
        <label htmlFor="chooseTypeRadio1"> {t('city-hall.externalLink')}</label>
      </FlexLine>

      {
        radioValue &&   <FormGroup>
          <FormLabel>
            {t('Push.Href')}
          </FormLabel>
          <FormInput
            type="text"
            placeholder="https://..."
            value={href}
            onChange={(e: any) => setHref(e.target.value)}
          />
        </FormGroup>
      }
      {
        !radioValue &&<FormGroup>
          <FormLabel>{t("city-hall.link")}</FormLabel>
          <FormInput
            className="form-control"
            as="textarea"
            rows={5}
            value={content}
            onChange={(e: any) => setContent(e.target.value)}
          />
        </FormGroup>
      }


      <SubmitBox>
        <Button variant="primary" type="submit" disabled={!title || (!radioValue && !content) || (radioValue && !href)} >
          {t('city-hall.create')}
        </Button>
      </SubmitBox>
    </Form>
  </CreateBox>
}
