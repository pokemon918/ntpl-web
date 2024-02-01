import React, {FC} from 'react';

import L18nText from 'components/shared/L18nText';

import './PageHeader.scss';

interface Props {
	title: string;
	description?: string;
}

const PageHeader: FC<Props> = ({title, description, children}) => (
	<div className="PageHeader__Container">
		<div className="PageHeader__Background">
			<div className="PageHeader__Content">
				<div className="PageHeader__Title">
					<L18nText id={title} defaultMessage={title} />
				</div>
				{description && (
					<div className="hide PageHeader__Description">
						<L18nText id={description} defaultMessage={description} />
					</div>
				)}
				<div className="PageHeader__Addon">{children}</div>
			</div>
		</div>
	</div>
);

export default PageHeader;
