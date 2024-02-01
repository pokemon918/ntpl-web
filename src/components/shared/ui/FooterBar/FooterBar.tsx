import React, {FC} from 'react';

import styles from './FooterBar.module.scss';

const FooterBar: FC = ({children}) => (
	<div className={styles.wrapper}>
		<div className={styles.container}>{children}</div>
	</div>
);

export default FooterBar;
