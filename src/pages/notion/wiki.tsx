import Notion from './notion';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
export default function Wiki() {
  const [list, setList] = useState(null);

  const { id } = useParams();
  const getData = async () => {
    //
    // let result = await axios.get(`https://kind-emu-97.deno.dev/page/ff997808ca6f4ee4843191219336b28d`);
    let result = await axios.get(`https://kind-emu-97.deno.dev/page/${id}`);
    console.log(result.data);
    setList(result.data);
  };

  useEffect(() => {
    getData();
  }, [id]);
  return <div>{list && <Notion recordMap={list} />}</div>;
}
