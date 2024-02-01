import React, {FC} from 'react';

import L18nText from 'components/shared/L18nText';

import styles from './FormSection.module.scss';

interface Props {
	title: string;
}

const FormSection: FC<Props> = ({children, title}) => (
	<div className={styles.container}>
		<div className={styles.text}>
			<L18nText id={title} defaultMessage={title} />
		</div>
		<hr className={styles.separator} />
		<div className={styles.fields}>{children}</div>
	</div>
);

export default FormSection;
