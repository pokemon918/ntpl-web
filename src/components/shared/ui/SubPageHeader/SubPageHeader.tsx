import React, {FC} from 'react';
import L18nText from 'components/shared/L18nText';

import styles from './SubPageHeader.module.scss';

interface Props {
	title: string;
	values?: Record<string, string | number>;
}

const SubPageHeader: FC<Props> = ({title, values}) => (
	<div className={styles.text}>
		{<L18nText id={title} defaultMessage={title} values={values} />}
	</div>
);

export default SubPageHeader;
