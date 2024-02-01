import React, {FC} from 'react';

import styles from './FormLabel.module.scss';
import L18nText from 'components/shared/L18nText';

interface Props {
	label: string;
	description?: string;
}

const FormLabel: FC<Props> = ({label, description, children}) => (
	<div className={styles.container}>
		<div className={styles.label}>
			<L18nText id={label} defaultMessage={label} />
			{description && (
				<div className={styles.description}>
					<L18nText id={description} defaultMessage={description} />
				</div>
			)}
		</div>
		<div className={styles.control}>{children}</div>
	</div>
);

export default FormLabel;
