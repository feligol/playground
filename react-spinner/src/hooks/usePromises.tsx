import { useState, useRef, useEffect } from "react";

const usePromises = (ref: React.RefObject<null | HTMLSpanElement>) => {
	const [data, setData] = useState<string[]>(["row1", "row2", "row3"]);
	const callback = (value: string) => {
		console.log("A signal was received");
		setData((d) => [...d, value]);
	};
	const triggerRef = useRef<null | Function>(null);
	const dispatch = () => triggerRef.current && triggerRef.current();
	useEffect(() => {
		triggerRef.current = setup(callback, ref);
		return cleanup;
	});
	return {
		data,
		trigger: dispatch,
	};
};

type SignalContainer = {
	data: React.RefObject<null | HTMLSpanElement>;
	signalCallback: Function;
	timeoutCounters: number[];
};

const createSignalContainer = (signalCallback: Function, ref: React.RefObject<HTMLSpanElement | null>): SignalContainer => ({
	data: ref,
	signalCallback,
	timeoutCounters: [],
});

type ModifiedWindow = typeof window & {
	signalContainer: null | SignalContainer;
};

const getServiceContainer = (signalCallback: Function, ref: React.RefObject<null | HTMLSpanElement>) => {
	const myWindow = window as ModifiedWindow;
	if (!myWindow.signalContainer) {
		myWindow.signalContainer = createSignalContainer(signalCallback, ref);
	}
	return myWindow.signalContainer;
};

const manipulateNode = (node: HTMLSpanElement) => {
	console.log("Should manipulate node: ", node);
	if (node.style.backgroundColor) {
		node.style.backgroundColor = "";
	} else {
		node.style.backgroundColor = "#777"
	}
}

const action = async (sc: SignalContainer) => {
	console.log("Action triggered")
	sc.data.current && manipulateNode(sc.data.current);
};

const setup = (signalCallback: Function, ref: React.RefObject<null | HTMLSpanElement>): Function => {
	const sc = getServiceContainer(signalCallback, ref);
	console.log("Setup", sc.timeoutCounters);
	return () => action(sc);
};

const cleanup = () => { };

export default usePromises;
