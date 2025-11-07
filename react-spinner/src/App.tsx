import { useRef } from "react";
import "./App.css";
import usePromises from "./hooks/usePromises";

export default App;
function App() {
	const lineRef = useRef<null | HTMLSpanElement>(null);
	const { data, trigger } = usePromises(lineRef);
	console.log("rendering app");
	return (
		<div>
			<button type="button" onClick={() => trigger()}>
				Click me
			</button>
			<span ref={lineRef}>somerow</span>
			<ul>
				{data.map((d, i) => (
					<li key={i.toString()}>{d}</li>
				))}
			</ul>
		</div>
	);
}
