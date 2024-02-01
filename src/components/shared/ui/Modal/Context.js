import React, {useState} from 'react';

const Context = React.createContext();

const Wrapper = ({children}) => {
	const [title, setTitle] = useState(null);
	const [subTitle, setSubTitle] = useState(null);
	const [breadcrumb, setBreadcrumb] = useState(null);

	const state = {
		title,
		setTitle,
		subTitle,
		setSubTitle,
		breadcrumb,
		setBreadcrumb,
	};

	return (
		<Context.Provider value={state}>
			<Context.Consumer>{children}</Context.Consumer>
		</Context.Provider>
	);
};

const Title = ({text}) => (
	<Context.Consumer>
		{({setTitle}) => {
			setTitle(text);
			return null;
		}}
	</Context.Consumer>
);

const SubTitle = ({text}) => (
	<Context.Consumer>
		{({setSubTitle}) => {
			setSubTitle(text);
			return null;
		}}
	</Context.Consumer>
);

const Breadcrumb = ({path}) => (
	<Context.Consumer>
		{({setBreadcrumb}) => {
			setBreadcrumb(path);
			return null;
		}}
	</Context.Consumer>
);

const ModalContext = {
	Wrapper,
	Title,
	SubTitle,
	Breadcrumb,
};

export default ModalContext;
