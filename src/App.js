import { createContext, useContext, useState } from "react";
import { treeData } from "./treeData";

export const DataContext = createContext(null);

const TreeNode = ({ node }) => {
	const { updateNode, removeNode } = useContext(DataContext);
	const [value, setValue] = useState("");
	const [childrenVisible, setChildrenVisible] = useState(true);

	const handleAddChild = (node) => {
		updateNode(node, {
			...node,
			children: [
				...node.children,
				{
					key: `${node.key}-${node.children.length}`,
					label: value,
					children: [],
				},
			],
		});
		setValue("");
	};

	const handleRemove = (node) => {
		removeNode(node);
	};

	return (
		<li className="item">
			<div className="item-label">
				<span>
					<button onClick={() => setChildrenVisible(!childrenVisible)}>{childrenVisible ? "v" : ">"}</button>
				</span>
				<span>
					<span>{node.label}</span>
					<button onClick={() => handleRemove(node)}>X</button>
				</span>
				<span>
					<input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
					<button onClick={() => handleAddChild(node)}>+ child</button>
				</span>
			</div>
			{/* Children */}
			{childrenVisible && node.children.length > 0 && node.children && <TreeView data={node.children} />}
		</li>
	);
};

export const TreeView = ({ data }) => {
	return (
		<ul>
			{data.map((node, index) => (
				<TreeNode key={index} node={node} />
			))}
		</ul>
	);
};

function App() {
	const [data, setData] = useState(treeData);

	const updateNode = (node, newData) => {
		// Recursively update a node in an array of nodes
		const updateNodeInChildren = (children, parentKey) => {
			return children.reduce((prev, curr) => {
				if (curr.key === parentKey) {
					return [...prev, { ...curr, ...newData }];
				}
				if (curr.children) {
					return [...prev, { ...curr, children: updateNodeInChildren(curr.children, parentKey) }];
				}
				return [...prev, curr];
			}, []);
		};

		setData((prevData) => {
			return updateNodeInChildren(prevData, node.key);
		});
	};

	const removeNode = (node) => {
		// Recursively remove node in a tree
		const removeNodeFromChildren = (children, parentKey) => {
			return children.reduce((prev, curr) => {
				if (curr.key === parentKey) return [...prev, ...curr.children];
				return [...prev, { ...curr, children: removeNodeFromChildren(curr.children, parentKey) }];
			}, []);
		};

		setData((prevData) =>
			prevData.reduce((prev, curr) => {
				if (curr.key === node.key) return prev;
				return [...prev, { ...curr, children: removeNodeFromChildren(curr.children, node.key) }];
			}, [])
		);
	};

	return (
		<DataContext.Provider value={{ data, updateNode, removeNode }}>
			<div className="App">
				<h1>Tree View</h1>
				<TreeView data={data} />
			</div>
		</DataContext.Provider>
	);
}

export default App;
