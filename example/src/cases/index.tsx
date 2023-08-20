import BasicCase from './Basic';
import GroupCase from './Group';
import LayoutCase from './Layout';
import ValidateCase from './Validae';
import WatchCase from './Watch';

const CaseList = [
	{
		title: '基础用法',
		Component: BasicCase,
	},
	{
		title: 'Layout用法',
		Component: LayoutCase,
	},
	{
		title: 'Group用法',
		Component: GroupCase,
	},
	{
		title: 'Watch用法',
		Component: WatchCase,
	},
	{
		title: '校验用法',
		Component: ValidateCase,
	},
];
export default CaseList;
