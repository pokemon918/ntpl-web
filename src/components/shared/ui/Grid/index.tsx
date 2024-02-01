import React from 'react';
import classNames from 'classnames';

import './Grid.scss';

interface Props {
	children: React.ReactNode;
	columns?: number;
	customizedColumns?: boolean;
}

const Grid = ({children, columns = 12, customizedColumns = false}: Props) => (
	<div
		className={classNames('Grid__Wrapper', [`columns_${columns}`], {
			noGutter: React.Children.count(children) === 1,
		})}
	>
		{React.Children.map(children, (child, index) => {
			const gridClass = classNames('Grid__Column', {
				Grid__Column_Customize: customizedColumns && index === 1,
			});

			return <div className={gridClass}>{child}</div>;
		})}
	</div>
);

export default Grid;
