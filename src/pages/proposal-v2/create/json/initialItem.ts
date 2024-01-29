import AddJson from './add.json';
import ApplyJson from './apply.json';
import CreateJson from './create.json';
import DelJson from './delMember.json';
import OtherJson from './other.json';

const initialItems: any[] = [
  {
    id: '1',
    title: '添加市政厅成员',
    src: 'https://mms0.baidu.com/it/u=480006263,2457381717&fm=253&app=138&f=JPEG?w=500&h=500',
    dragType: 'image',
    auto_action: 'auto_action1',
    componentData: AddJson,
    name: 'add',
  },
  {
    id: '2',
    title: '资产申请',
    src: 'https://img0.baidu.com/it/u=1119404505,3019956218&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    dragType: 'image',
    auto_action: 'auto_action2',
    componentData: ApplyJson,
    name: 'apply',
  },
  {
    id: '3',
    title: '创建公共项目申请',
    src: 'https://img1.baidu.com/it/u=38051914,745056107&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=802',
    dragType: 'image',
    auto_action: 'auto_action3',
    componentData: CreateJson,
    name: 'create',
  },
  {
    id: '4',
    title: '删除市政厅',
    src: 'https://img0.baidu.com/it/u=3979949991,2513156939&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    dragType: 'image',
    auto_action: 'auto_action4',
    componentData: DelJson,
    name: 'delete',
  },
  {
    id: '5',
    title: 'others',
    src: 'https://img0.baidu.com/it/u=46644979,2438128608&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    dragType: 'image',
    auto_action: 'auto_action5',
    componentData: OtherJson,
    name: 'others',
  },
];
export default initialItems;
