import { Radio } from 'antd';
import { useState } from 'react';
import './App.css';
import CaseList from './cases';

function App() {
	const [currentCase, setCurrentCase] = useState(CaseList[0].title);
	const Component = CaseList.find((item) => item.title === currentCase)?.Component;
	return (
		<>
			<Radio.Group
				value={currentCase}
				onChange={(e) => setCurrentCase(e.target.value)}
				style={{ marginBottom: 12 }}>
				{CaseList.map((item) => (
					<Radio.Button value={item.title} key={item.title}>
						{item.title}
					</Radio.Button>
				))}
			</Radio.Group>
			{Component && <Component />}
		</>
	);
}

export default App;
